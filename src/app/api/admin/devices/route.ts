import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const registerDeviceSchema = z.object({
  token: z.string().min(10, "Token is too short").max(600),
  platform: z.string().max(100).optional(),
  userAgent: z.string().max(300).optional(),
});

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection("adminDevices").get();
    const devices = snap.docs.map((doc) => {
      const data = doc.data();
      const rawToken = (data.token as string) || "";
      return {
        id: doc.id,
        tokenSnippet:
          rawToken.length > 20
            ? `${rawToken.substring(0, 10)}...${rawToken.substring(rawToken.length - 8)}`
            : rawToken,
        platform: (data.platform as string) || "web",
        userAgent: (data.userAgent as string) || "Unknown browser / device",
        createdAt: (data.createdAt as string) || null,
        lastSeenAt: (data.lastSeenAt as string) || null,
        adminEmail: (data.adminEmail as string) || "",
      };
    });

    // Sort by lastSeenAt desc
    devices.sort((a, b) => {
      const timeA = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
      const timeB = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
      return timeB - timeA;
    });

    return NextResponse.json({ success: true, devices });
  } catch (err) {
    console.error("[api/admin/devices] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch registered devices", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parseResult = registerDeviceSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid device registration data", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { token, platform, userAgent } = parseResult.data;
    const db = getAdminDb();
    const nowIso = new Date().toISOString();

    // Use deterministic SHA-256 hash of token as doc ID for safe Firestore indexing
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const docRef = db.collection("adminDevices").doc(tokenHash);
    const existingSnap = await docRef.get();

    const createdAt = existingSnap.exists
      ? (existingSnap.data()?.createdAt as string) || nowIso
      : nowIso;

    await docRef.set(
      {
        token,
        tokenHash,
        adminEmail: admin.email,
        platform: platform || "web",
        userAgent: userAgent || req.headers.get("user-agent") || "unknown",
        createdAt,
        lastSeenAt: nowIso,
      },
      { merge: true }
    );

    // Clean up legacy doc that might have used raw token as doc ID
    if (token !== tokenHash) {
      try {
        await db.collection("adminDevices").doc(token).delete();
      } catch {
        // ignore legacy cleanup error
      }
    }

    return NextResponse.json({ success: true, id: tokenHash });
  } catch (err) {
    console.error("[api/admin/devices] Error registering device token:", err);
    return NextResponse.json(
      { error: "Failed to register admin device token", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const id = searchParams.get("id") || body?.id;
    const token = body?.token;

    if (!id && !token) {
      return NextResponse.json(
        { error: "Device ID or token is required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const deletePromises: Promise<unknown>[] = [];

    if (id) {
      deletePromises.push(db.collection("adminDevices").doc(id).delete());
    }
    if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      deletePromises.push(db.collection("adminDevices").doc(tokenHash).delete());
      deletePromises.push(db.collection("adminDevices").doc(token).delete());
    }

    await Promise.allSettled(deletePromises);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/admin/devices] Error deleting device token:", err);
    return NextResponse.json(
      { error: "Failed to unregister admin device", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
