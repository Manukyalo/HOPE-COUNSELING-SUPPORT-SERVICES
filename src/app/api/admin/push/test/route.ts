import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb, getAdminMessaging, hasAdminCredentials } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  if (!hasAdminCredentials()) {
    return NextResponse.json(
      {
        error: "Firebase Admin credentials not configured on server.",
        code: "CONFIG_ERROR",
      },
      { status: 500 }
    );
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection("adminDevices").get();

    if (snap.empty) {
      return NextResponse.json({
        success: false,
        message: "No admin devices are currently registered. Tap 'Enable Notifications' on this phone first.",
        totalDevices: 0,
        successCount: 0,
        failureCount: 0,
        results: [],
      });
    }

    const tokens: string[] = [];
    const docIds: string[] = [];
    const userAgents: string[] = [];

    snap.docs.forEach((doc) => {
      const data = doc.data();
      const token = (data.token as string) || "";
      if (token) {
        tokens.push(token);
        docIds.push(doc.id);
        userAgents.push((data.userAgent as string) || "Unknown device");
      }
    });

    if (tokens.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No valid tokens found in registered devices.",
        totalDevices: 0,
        successCount: 0,
        failureCount: 0,
        results: [],
      });
    }

    const messaging = getAdminMessaging();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://hope-counseling-support-services.vercel.app";
    const adminUrl = `${appUrl.replace(/\/$/, "")}/admin`;

    const nowStr = new Date().toLocaleTimeString("en-KE", { timeZone: "Africa/Nairobi" });
    const title = "🔔 Hope Counseling — Test Push";
    const body = `Screen-off verification successful at ${nowStr} EAT. System alerts are operational.`;

    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data: {
        type: "test",
        url: "/admin",
        timestamp: new Date().toISOString(),
      },
      webpush: {
        headers: {
          Urgency: "high",
          TTL: "86400",
        },
        notification: {
          title,
          body,
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          tag: "test-notification",
          requireInteraction: true,
        },
        fcmOptions: {
          link: adminUrl,
        },
      },
    });

    const results: Array<{
      id: string;
      tokenSnippet: string;
      userAgent: string;
      status: "sent" | "failed";
      errorCode?: string;
      errorMessage?: string;
    }> = [];

    const deletePromises: Promise<unknown>[] = [];

    response.responses.forEach((resp, idx) => {
      const fullToken = tokens[idx];
      const tokenSnippet =
        fullToken.length > 20
          ? `${fullToken.substring(0, 10)}...${fullToken.substring(fullToken.length - 8)}`
          : fullToken;

      if (resp.success) {
        results.push({
          id: docIds[idx],
          tokenSnippet,
          userAgent: userAgents[idx],
          status: "sent",
        });
      } else {
        const errCode = resp.error?.code || "unknown";
        console.error(
          `[TEST PUSH] Device [${docIds[idx]}] delivery failed: ${errCode} - ${resp.error?.message}`
        );

        results.push({
          id: docIds[idx],
          tokenSnippet,
          userAgent: userAgents[idx],
          status: "failed",
          errorCode: errCode,
          errorMessage: resp.error?.message,
        });

        // Prune only unregistered or invalid argument tokens
        if (
          errCode === "messaging/registration-token-not-registered" ||
          errCode === "messaging/invalid-argument"
        ) {
          deletePromises.push(db.collection("adminDevices").doc(docIds[idx]).delete());
        }
      }
    });

    if (deletePromises.length > 0) {
      await Promise.allSettled(deletePromises);
    }

    return NextResponse.json({
      success: response.successCount > 0,
      totalDevices: tokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
      message:
        response.successCount > 0
          ? `Test push dispatched successfully to ${response.successCount} device(s).`
          : "All registered devices failed to receive test push.",
      results,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[api/admin/push/test] Error dispatching test push:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to dispatch test notification",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
