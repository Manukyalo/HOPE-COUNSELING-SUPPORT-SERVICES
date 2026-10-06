import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { sendSessionReminderSms } from "@/lib/notifications";
import { Booking } from "@/types/booking";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized access to scheduled jobs", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const db = getAdminDb();
    const now = new Date();

    // Query confirmed bookings for next 26 hours
    const minStart = new Date(now.getTime() + 1 * 3600 * 1000).toISOString();
    const maxStart = new Date(now.getTime() + 26 * 3600 * 1000).toISOString();

    const snap = await db
      .collection("bookings")
      .where("status", "==", "confirmed")
      .where("startUtc", ">=", minStart)
      .where("startUtc", "<=", maxStart)
      .get();

    let sent24h = 0;
    let sent2h = 0;

    for (const doc of snap.docs) {
      const booking = doc.data() as Booking;
      const sessionTime = new Date(booking.startUtc).getTime();
      const diffHours = (sessionTime - now.getTime()) / (3600 * 1000);

      // 24h window (between 23 and 25 hours away)
      if (diffHours >= 23 && diffHours <= 25 && !booking.reminderSent24h) {
        const sent = await sendSessionReminderSms(booking, "24h");
        if (sent) {
          await doc.ref.update({ reminderSent24h: true });
          sent24h++;
        }
      }

      // 2h window (between 1.5 and 2.5 hours away)
      if (diffHours >= 1.5 && diffHours <= 2.5 && !booking.reminderSent2h) {
        const sent = await sendSessionReminderSms(booking, "2h");
        if (sent) {
          await doc.ref.update({ reminderSent2h: true });
          sent2h++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: snap.size,
      remindersSent: { sent24h, sent2h },
    });
  } catch (err) {
    console.error("[api/cron/reminders] Error:", err);
    return NextResponse.json({ error: "Reminder runner failed" }, { status: 500 });
  }
}
