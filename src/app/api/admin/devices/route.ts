import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const registerDeviceSchema = z.object({
  token: z.string().min(10, "Token is too short").max(500),
  platform: z.string().max(100).optional(),
  userAgent: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  const adminEmail = verifyAdminSession(req);
  if (!adminEmail) {
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

    // Use token directly as the document ID to prevent duplicate device entries
    await db.collection("adminDevices").doc(token).set(
      {
        token,
        adminEmail,
        platform: platform || "web",
        userAgent: userAgent || req.headers.get("user-agent") || "unknown",
        lastSeenAt: nowIso,
        createdAt: nowIso,
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/admin/devices] Error registering device token:", err);
    return NextResponse.json(
      { error: "Failed to register admin device token", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const adminEmail = verifyAdminSession(req);
  if (!adminEmail) {
    return NextResponse.json(
      { error: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const token = body?.token;
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token is required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    await db.collection("adminDevices").doc(token).delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/admin/devices] Error deleting device token:", err);
    return NextResponse.json(
      { error: "Failed to unregister admin device", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
