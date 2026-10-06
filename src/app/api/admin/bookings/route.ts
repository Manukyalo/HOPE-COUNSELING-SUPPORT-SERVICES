import { NextRequest, NextResponse } from "next/server";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { Booking, BookingStatus } from "@/types/booking";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const adminEmail = verifyAdminSession(req);
  if (!adminEmail) {
    return NextResponse.json(
      { error: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // all, pending, confirmed, cancelled, completed, no_show
    const search = searchParams.get("search")?.toLowerCase().trim();

    const db = getAdminDb();
    let queryRef = db
      .collection("bookings")
      .orderBy("createdAt", "desc")
      .limit(100);

    if (status && status !== "all") {
      queryRef = db
        .collection("bookings")
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .limit(100);
    }

    const snap = await queryRef.get();
    let bookings: Booking[] = snap.docs.map((doc: QueryDocumentSnapshot) => doc.data() as Booking);

    if (search) {
      bookings = bookings.filter(
        (b: Booking) =>
          b.clientName.toLowerCase().includes(search) ||
          b.clientEmail.toLowerCase().includes(search) ||
          b.clientPhone.includes(search) ||
          b.id.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, bookings });
  } catch (err) {
    console.error("[api/admin/bookings] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const adminEmail = verifyAdminSession(req);
  if (!adminEmail) {
    return NextResponse.json(
      { error: "Unauthorized access", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { bookingId, status, notes } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const bookingDocRef = db.collection("bookings").doc(bookingId);
    const bSnap = await bookingDocRef.get();

    if (!bSnap.exists) {
      return NextResponse.json(
        { error: "Booking not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const booking = bSnap.data() as Booking;
    const nowIso = new Date().toISOString();

    const updates: Partial<Booking> = {
      updatedAt: nowIso,
    };

    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (status) {
      updates.status = status as BookingStatus;

      // If status changed to cancelled, release deterministic slot lock
      if (status === "cancelled" && booking.status !== "cancelled") {
        await db.collection("slots").doc(booking.slotId).delete().catch(() => {});
      }

      // If status changed to confirmed from cancelled, lock slot if available
      if (status === "confirmed" && booking.status === "cancelled") {
        await db.collection("slots").doc(booking.slotId).set({
          slotId: booking.slotId,
          bookingId: booking.id,
          counselorId: booking.counselorId,
          startUtc: booking.startUtc,
          endUtc: booking.endUtc,
          status: "active",
          createdAt: nowIso,
          updatedAt: nowIso,
        });
      }
    }

    await bookingDocRef.update(updates);

    return NextResponse.json({
      success: true,
      booking: { ...booking, ...updates },
    });
  } catch (err) {
    console.error("[api/admin/bookings] PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update booking", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
