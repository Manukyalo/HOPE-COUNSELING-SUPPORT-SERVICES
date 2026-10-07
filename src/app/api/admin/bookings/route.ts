import { NextRequest, NextResponse } from "next/server";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { Booking, BookingStatus } from "@/types/booking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
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
      bookings = bookings.filter((b: Booking) => {
        const name = (b.client?.name || b.clientName || "").toLowerCase();
        const email = (b.client?.email || b.clientEmail || "").toLowerCase();
        const phone = b.client?.phone || b.clientPhone || "";
        const ref = (b.referenceCode || b.id || "").toLowerCase();
        return (
          name.includes(search) ||
          email.includes(search) ||
          phone.includes(search) ||
          ref.includes(search)
        );
      });
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
  const admin = await verifyAdmin(req);
  if (!admin) {
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

    if (body.adminSeen !== undefined) {
      updates.adminSeen = Boolean(body.adminSeen);
    }

    if (status) {
      updates.status = status as BookingStatus;

      // If status changed to cancelled, release deterministic slot lock
      if (status === "cancelled" && booking.status !== "cancelled") {
        const slotKey = `${booking.date}_${booking.time || booking.timeFormatted}`;
        await Promise.allSettled([
          db.collection("slots").doc(booking.slotId).delete(),
          db.collection("slotLocks").doc(slotKey).delete(),
        ]);
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
    let bookingId = searchParams.get("id") || searchParams.get("bookingId");

    if (!bookingId) {
      try {
        const body = await req.json();
        bookingId = body.bookingId || body.id;
      } catch {
        // Query param used or empty body
      }
    }

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const deletePromises: Promise<unknown>[] = [];

    // 1. Direct document check by document ID
    const bookingDocRef = db.collection("bookings").doc(bookingId);
    const bSnap = await bookingDocRef.get();

    if (bSnap.exists) {
      const booking = bSnap.data() as Booking;
      deletePromises.push(bookingDocRef.delete());

      // Release reserved slot document if present
      if (booking.slotId) {
        deletePromises.push(db.collection("slots").doc(booking.slotId).delete());
      }

      // Release deterministic slot lock if present
      const timeVal = booking.time || booking.timeFormatted;
      if (booking.date && timeVal) {
        const slotKey = `${booking.date}_${timeVal}`;
        deletePromises.push(db.collection("slotLocks").doc(slotKey).delete());
      }
    }

    // 2. Query fallback: also clean up any documents indexed by referenceCode or id field
    const [byRefSnap, byIdSnap] = await Promise.all([
      db.collection("bookings").where("referenceCode", "==", bookingId).get(),
      db.collection("bookings").where("id", "==", bookingId).get(),
    ]);

    const matchingDocs = [...byRefSnap.docs, ...byIdSnap.docs];
    for (const doc of matchingDocs) {
      if (doc.id !== bookingId) {
        const booking = doc.data() as Booking;
        deletePromises.push(doc.ref.delete());
        if (booking.slotId) {
          deletePromises.push(db.collection("slots").doc(booking.slotId).delete());
        }
        const timeVal = booking.time || booking.timeFormatted;
        if (booking.date && timeVal) {
          const slotKey = `${booking.date}_${timeVal}`;
          deletePromises.push(db.collection("slotLocks").doc(slotKey).delete());
        }
      }
    }

    // Ensure the targeted doc is deleted even if it was partially created
    if (!bSnap.exists) {
      deletePromises.push(bookingDocRef.delete());
    }

    await Promise.allSettled(deletePromises);

    return NextResponse.json({
      success: true,
      deletedId: bookingId,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    console.error("[api/admin/bookings] DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete booking", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
