import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { getAvailabilityRules, getBlockedDates } from "@/lib/booking-engine";
import { AvailabilityRules, BlockedDate } from "@/types/booking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const adminEmail = verifyAdminSession(req);
  if (!adminEmail) {
    return NextResponse.json(
      { error: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const [rules, blockedDates] = await Promise.all([
      getAvailabilityRules(),
      getBlockedDates(),
    ]);

    return NextResponse.json({
      success: true,
      rules,
      blockedDates,
    });
  } catch (err) {
    console.error("[api/admin/availability] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch availability rules", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

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
    const { action, rules, blockedDate, blockedDateId } = body;
    const db = getAdminDb();

    if (action === "update_rules" && rules) {
      const updatedRules: AvailabilityRules = {
        ...rules,
        updatedAt: new Date().toISOString(),
      };
      await db.collection("availabilityRules").doc("primary").set(updatedRules, { merge: true });
      return NextResponse.json({ success: true, rules: updatedRules });
    }

    if (action === "add_blocked_date" && blockedDate) {
      const docRef = db.collection("blockedDates").doc();
      const newBlocked: BlockedDate = {
        id: docRef.id,
        startDate: blockedDate.startDate,
        endDate: blockedDate.endDate,
        reason: blockedDate.reason || "Unavailable / Leave",
        allDay: blockedDate.allDay ?? true,
        startTime: blockedDate.startTime,
        endTime: blockedDate.endTime,
        createdAt: new Date().toISOString(),
      };
      await docRef.set(newBlocked);
      return NextResponse.json({ success: true, blockedDate: newBlocked });
    }

    if (action === "delete_blocked_date" && blockedDateId) {
      await db.collection("blockedDates").doc(blockedDateId).delete();
      return NextResponse.json({ success: true, deletedId: blockedDateId });
    }

    return NextResponse.json({ error: "Invalid action", code: "BAD_REQUEST" }, { status: 400 });
  } catch (err) {
    console.error("[api/admin/availability] POST error:", err);
    return NextResponse.json(
      { error: "Failed to update availability settings", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
