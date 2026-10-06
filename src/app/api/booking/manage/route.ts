import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { cancelBookingByToken } from "@/lib/booking-engine";
import { Booking } from "@/types/booking";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const action = searchParams.get("action"); // "cancel" or "reschedule"

    if (!token || !action) {
      return NextResponse.json(
        { error: "Token and action are required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const tokenDoc = await db.collection("bookingTokens").doc(`${action}_${token}`).get();

    if (!tokenDoc.exists) {
      return NextResponse.json(
        { error: "Invalid or expired link", code: "INVALID_TOKEN" },
        { status: 404 }
      );
    }

    const { bookingId, expiresAt } = tokenDoc.data() as { bookingId: string; expiresAt: string };
    if (new Date(expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This secure link has expired", code: "TOKEN_EXPIRED" },
        { status: 410 }
      );
    }

    const bookingDoc = await db.collection("bookings").doc(bookingId).get();
    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: "Booking not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const booking = bookingDoc.data() as Booking;

    // Return sanitized metadata only (no full PII needed)
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        date: booking.date,
        timeFormatted: booking.timeFormatted,
        sessionType: booking.sessionType,
        deliveryMode: booking.deliveryMode,
        status: booking.status,
      },
    });
  } catch (err) {
    console.error("[api/booking/manage] GET error:", err);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, action } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    if (action === "cancel") {
      const cancelledBooking = await cancelBookingByToken(token);
      return NextResponse.json({
        success: true,
        message: "Your appointment has been cancelled successfully.",
        bookingRef: cancelledBooking.id,
      });
    }

    return NextResponse.json(
      { error: "Unsupported action", code: "BAD_REQUEST" },
      { status: 400 }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[api/booking/manage] POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request", code: "ACTION_FAILED" },
      { status: 400 }
    );
  }
}
