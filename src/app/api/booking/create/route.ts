import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { bookSlotTransaction } from "@/lib/booking-engine";
import {
  notifyCounselorNewBooking,
  sendClientConfirmationSms,
  notifyAdminDevices,
} from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Zod validation schema for incoming booking request
const createBookingSchema = z.object({
  slotId: z.string().min(3),
  startUtc: z.string().datetime(),
  clientName: z.string().min(2, "Name must be at least 2 characters").max(100),
  clientEmail: z.string().email("Valid email address is required"),
  clientPhone: z
    .string()
    .min(9, "Phone number is too short")
    .max(16, "Phone number is too long")
    .regex(/^[0-9+() -]+$/, "Phone contains invalid characters"),
  sessionType: z.enum([
    "individual",
    "online",
    "student",
    "couples",
    "initial",
    "student-pkg",
    "personal-pkg",
    "extended-pkg",
  ]),
  deliveryMode: z.enum(["online", "in_person"]),
  notes: z.string().max(500).optional(),
  website_hp: z.string().optional(), // Honeypot field
});

// Basic sliding window rate limiting per IP in memory
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 10 * 60 * 1000 }); // 10 min window
    return false;
  }

  if (record.count >= 6) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous-client";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: "Too many booking requests. Please wait a few minutes before trying again.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await req.json();

    // Honeypot check: automated bot traps
    if (body.website_hp && body.website_hp.trim() !== "") {
      console.warn("[bot-trap] Honeypot triggered from IP:", ip);
      // Return fake success to confuse scraper
      return NextResponse.json({
        success: true,
        bookingRef: "HC-CONFIRMED",
      });
    }

    const parseResult = createBookingSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        { error: firstError, details: parseResult.error.format(), code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 3. Atomic Transactional Booking
    let booking;
    try {
      booking = await bookSlotTransaction({
        slotId: data.slotId,
        startUtc: data.startUtc,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        sessionType: data.sessionType,
        deliveryMode: data.deliveryMode,
        notes: data.notes,
      });
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message?.startsWith("SLOT_TAKEN")) {
        return NextResponse.json(
          {
            error: "That slot was just taken by another client, please pick another available time.",
            code: "SLOT_CONFLICT",
          },
          { status: 409 }
        );
      }
      throw err;
    }

    // 4. Background Notifications (Non-blocking)
    Promise.allSettled([
      sendClientConfirmationSms(booking),
      notifyCounselorNewBooking(booking),
      notifyAdminDevices(booking),
    ]).catch((err) => {
      console.error("[api/booking/create] Notification trigger error:", err);
    });

    const host =
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      "hope-counseling-support-services.vercel.app";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${protocol}://${host}`;

    return NextResponse.json({
      success: true,
      bookingRef: booking.referenceCode || booking.id,
      booking: {
        id: booking.id,
        referenceCode: booking.referenceCode || booking.id,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        timeFormatted: booking.timeFormatted || booking.time,
        sessionType: booking.sessionType,
        deliveryMode: booking.deliveryMode,
        price: booking.price,
        currency: booking.currency,
        client: booking.client,
        clientName: booking.client?.name || booking.clientName,
        clientEmail: booking.client?.email || booking.clientEmail,
        clientPhone: booking.client?.phone || booking.clientPhone,
        notes: booking.notes || booking.client?.notes,
        startUtc: booking.startUtc,
        endUtc: booking.endUtc,
      },
      cancelUrl: `${baseUrl}/book/manage?action=cancel&token=${booking.cancelToken}`,
      rescheduleUrl: `${baseUrl}/book/manage?action=reschedule&token=${booking.rescheduleToken}`,
      calendarIcsUrl: `${baseUrl}/api/booking/calendar?ref=${booking.referenceCode || booking.id}`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[api/booking/create] Server error:", error);
    return NextResponse.json(
      {
        error: "Unable to complete booking. Please try again or contact support.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
