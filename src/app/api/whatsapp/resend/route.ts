import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  sendWhatsAppText,
  buildClientConfirmationMessage,
  normalizePhoneKE,
} from "@/lib/whatsapp";
import { getAdminDb, hasAdminCredentials } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const resendSchema = z.object({
  bookingId: z.string().min(1),
});

/**
 * POST /api/whatsapp/resend
 * Admin-only: re-sends the WhatsApp confirmation to the client for a given booking.
 * Fetches booking data fresh from Firestore so no stale data is used.
 */
export async function POST(req: NextRequest) {
  const session = verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = resendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "bookingId is required", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (!hasAdminCredentials()) {
    return NextResponse.json(
      { error: "Firebase Admin not configured", code: "CONFIG_ERROR" },
      { status: 503 }
    );
  }

  const db = getAdminDb();
  const docSnap = await db.collection("bookings").doc(parsed.data.bookingId).get();

  if (!docSnap.exists) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const booking = { id: docSnap.id, ...docSnap.data() } as Record<string, unknown> & {
    id: string;
  };

  const clientPhone =
    (booking.clientPhone as string | undefined) ||
    ((booking.client as { phone?: string } | undefined)?.phone);

  if (!clientPhone) {
    return NextResponse.json(
      { error: "No phone number on this booking", code: "NO_PHONE" },
      { status: 422 }
    );
  }

  const message = buildClientConfirmationMessage(booking as never);
  const result = await sendWhatsAppText(clientPhone, message);

  // Persist updated status
  const update: Record<string, unknown> = {
    waStatus: result.ok ? "sent" : "failed",
    waSentAt: result.ok ? new Date().toISOString() : null,
    waResentBy: session.email,
    waResentAt: new Date().toISOString(),
  };
  if (!result.ok) update.waError = result.reason;
  else delete update.waError;

  await db.collection("bookings").doc(parsed.data.bookingId).update(update);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason, code: "WA_FAILED" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
