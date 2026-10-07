import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { generateIcsContent } from "@/lib/booking-engine";
import { Booking } from "@/types/booking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");

    if (!ref || !/^HCS?-[A-Z0-9]+$/i.test(ref)) {
      return new NextResponse("Invalid booking reference", { status: 400 });
    }

    const db = getAdminDb();
    const docSnap = await db.collection("bookings").doc(ref.toUpperCase()).get();

    if (!docSnap.exists) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    const booking = docSnap.data() as Booking;
    const icsString = generateIcsContent(booking);

    return new NextResponse(icsString, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="hope-counseling-${booking.id}.ics"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("[api/booking/calendar] Error generating calendar file:", err);
    return new NextResponse("Failed to generate calendar file", { status: 500 });
  }
}
