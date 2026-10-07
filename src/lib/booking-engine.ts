import {
  AvailabilityRules,
  BlockedDate,
  Booking,
  DayAvailabilitySummary,
  PublicSlotSummary,
  SessionType,
  DeliveryMode,
} from "@/types/booking";
import { DEFAULT_AVAILABILITY_RULES, SERVICE_DETAILS, TIMEZONE_EAT } from "./booking-constants";
import { getAdminDb, hasAdminCredentials } from "./firebase-admin";
import { QueryDocumentSnapshot, Transaction, DocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import crypto from "crypto";

const RULES_COLLECTION = "availabilityRules";
const BLOCKED_DATES_COLLECTION = "blockedDates";
const BOOKINGS_COLLECTION = "bookings";
const SLOTS_COLLECTION = "slots";
const TOKENS_COLLECTION = "bookingTokens";

/**
 * Parses a YYYY-MM-DD string into a Date object representing midnight in EAT (UTC+3)
 */
export function parseEatDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  // In UTC+3, midnight EAT is (year, month-1, day, -3 hours UTC) = previous day 21:00 UTC
  const utcMillis = Date.UTC(year, month - 1, day, -3, 0, 0, 0);
  return new Date(utcMillis);
}

/**
 * Formats a Date object into "YYYY-MM-DD" in EAT
 */
export function formatToEatDateString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE_EAT,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

/**
 * Formats a Date object into "HH:mm" in EAT
 */
export function formatToEatTimeString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE_EAT,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(date);
}

/**
 * Gets day of week (0 = Sunday, 1 = Monday... 6 = Saturday) for an EAT date string
 */
export function getEatDayOfWeek(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Use Date.UTC noon to avoid DST/timezone boundary shifts
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return d.getUTCDay();
}

/**
 * Determines whether the counselor has active bookable weekly hours configured.
 */
export function isScheduleConfigured(rules: AvailabilityRules): boolean {
  if (!rules || !rules.weeklySchedule) return false;
  return Object.values(rules.weeklySchedule).some((day) => day && day.enabled);
}

/**
 * Loads current availability rules from Firestore, or returns defaults
 */
export async function getAvailabilityRules(): Promise<AvailabilityRules> {
  if (!hasAdminCredentials()) {
    return DEFAULT_AVAILABILITY_RULES;
  }
  try {
    const db = getAdminDb();
    const docSnap = await db.collection(RULES_COLLECTION).doc("primary").get();
    if (docSnap.exists) {
      return { ...DEFAULT_AVAILABILITY_RULES, ...(docSnap.data() as AvailabilityRules) };
    }
  } catch (err) {
    console.warn("[booking-engine] Could not fetch rules from Firestore, using defaults:", err);
  }
  return DEFAULT_AVAILABILITY_RULES;
}

/**
 * Loads all blocked dates from Firestore
 */
export async function getBlockedDates(): Promise<BlockedDate[]> {
  if (!hasAdminCredentials()) {
    return [];
  }
  try {
    const db = getAdminDb();
    const snap = await db.collection(BLOCKED_DATES_COLLECTION).get();
    return snap.docs.map((d: QueryDocumentSnapshot) => ({
      id: d.id,
      ...(d.data() as Omit<BlockedDate, "id">),
    }));
  } catch (err) {
    console.warn("[booking-engine] Could not fetch blocked dates:", err);
    return [];
  }
}

/**
 * Checks if a specific date or time range is blocked
 */
function isDateBlocked(
  dateStr: string,
  blockedDates: BlockedDate[],
  timeStr?: string
): boolean {
  for (const b of blockedDates) {
    if (dateStr >= b.startDate && dateStr <= b.endDate) {
      if (b.allDay) return true;
      if (timeStr && b.startTime && b.endTime) {
        if (timeStr >= b.startTime && timeStr < b.endTime) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Generates slot definitions for a specific EAT date string (YYYY-MM-DD)
 */
export function generateDayRawSlots(
  dateStr: string,
  rules: AvailabilityRules,
  blockedDates: BlockedDate[]
): { startUtc: string; endUtc: string; timeFormatted: string }[] {
  const dayOfWeek = getEatDayOfWeek(dateStr);
  const schedule = rules.weeklySchedule[dayOfWeek];

  if (!schedule || !schedule.enabled) {
    return [];
  }

  if (isDateBlocked(dateStr, blockedDates)) {
    return [];
  }

  const [startH, startM] = schedule.start.split(":").map(Number);
  const [endH, endM] = schedule.end.split(":").map(Number);

  const [year, month, day] = dateStr.split("-").map(Number);

  const durationMin = rules.sessionDurationMinutes;
  const bufferMin = rules.bufferMinutes;
  const stepMin = durationMin + bufferMin;

  const slots: { startUtc: string; endUtc: string; timeFormatted: string }[] = [];

  let currentMinuteOfDay = startH * 60 + startM;
  const endMinuteOfDay = endH * 60 + endM;

  while (currentMinuteOfDay + durationMin <= endMinuteOfDay) {
    const slotHour = Math.floor(currentMinuteOfDay / 60);
    const slotMin = currentMinuteOfDay % 60;
    const timeFormatted = `${String(slotHour).padStart(2, "0")}:${String(slotMin).padStart(2, "0")}`;

    // Check if slot falls in a partial blocked date
    if (isDateBlocked(dateStr, blockedDates, timeFormatted)) {
      currentMinuteOfDay += stepMin;
      continue;
    }

    // Check break period
    if (schedule.breakStart && schedule.breakEnd) {
      const [breakStartH, breakStartM] = schedule.breakStart.split(":").map(Number);
      const [breakEndH, breakEndM] = schedule.breakEnd.split(":").map(Number);
      const breakStartMinutes = breakStartH * 60 + breakStartM;
      const breakEndMinutes = breakEndH * 60 + breakEndM;

      const slotEndMinute = currentMinuteOfDay + durationMin;
      const overlapsBreak =
        (currentMinuteOfDay >= breakStartMinutes && currentMinuteOfDay < breakEndMinutes) ||
        (slotEndMinute > breakStartMinutes && slotEndMinute <= breakEndMinutes) ||
        (currentMinuteOfDay <= breakStartMinutes && slotEndMinute >= breakEndMinutes);

      if (overlapsBreak) {
        currentMinuteOfDay += stepMin;
        continue;
      }
    }

    // Convert to UTC ISO string (EAT is UTC+3)
    const slotDateUtc = new Date(Date.UTC(year, month - 1, day, slotHour - 3, slotMin, 0));
    const slotEndDateUtc = new Date(
      Date.UTC(year, month - 1, day, slotHour - 3, slotMin + durationMin, 0)
    );

    slots.push({
      startUtc: slotDateUtc.toISOString(),
      endUtc: slotEndDateUtc.toISOString(),
      timeFormatted,
    });

    currentMinuteOfDay += stepMin;
  }

  return slots;
}

/**
 * Returns month-grid day availability summaries without any PII.
 */
export async function getMonthAvailability(
  yearMonth: string // "YYYY-MM"
): Promise<{ availability: Record<string, DayAvailabilitySummary>; isConfigured: boolean }> {
  const rules = await getAvailabilityRules();
  const isConfigured = isScheduleConfigured(rules);
  const blockedDates = await getBlockedDates();

  const [year, month] = yearMonth.split("-").map(Number);
  const now = new Date();

  // Min advance cut-off (e.g. 12 hours)
  const minAdvanceMillis = (rules.minAdvanceHours || 12) * 60 * 60 * 1000;
  const earliestBookableUtc = new Date(now.getTime() + minAdvanceMillis);

  // Max advance cut-off (e.g. 60 days)
  const maxAdvanceMillis = (rules.bookingWindowDays || 60) * 24 * 60 * 60 * 1000;
  const latestBookableUtc = new Date(now.getTime() + maxAdvanceMillis);

  // Days in month
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const results: Record<string, DayAvailabilitySummary> = {};

  // Fetch taken slots for this month from DB (if credentials available)
  const monthStartUtc = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)).toISOString();
  const monthEndUtc = new Date(Date.UTC(year, month, 1, 23, 59, 59)).toISOString();

  const takenSlotsMap = new Set<string>();

  if (hasAdminCredentials()) {
    try {
      const db = getAdminDb();
      const slotsSnap = await db
        .collection(SLOTS_COLLECTION)
        .where("startUtc", ">=", monthStartUtc)
        .where("startUtc", "<=", monthEndUtc)
        .get();

      const nowIso = now.toISOString();
      slotsSnap.docs.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        if (data.status === "active") {
          takenSlotsMap.add(doc.id);
        } else if (data.status === "held" && data.holdExpiresAt && data.holdExpiresAt > nowIso) {
          takenSlotsMap.add(doc.id);
        }
      });
    } catch (err) {
      console.warn("[booking-engine] Error querying active slots:", err);
    }
  }

  for (let day = 1; day <= lastDayOfMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const rawSlots = generateDayRawSlots(dateStr, rules, blockedDates);

    if (rawSlots.length === 0) {
      results[dateStr] = {
        date: dateStr,
        status: "unavailable",
        availableSlotsCount: 0,
        totalSlotsCount: 0,
      };
      continue;
    }

    let availableCount = 0;
    let bookedCount = 0;
    let windowSlotsCount = 0;

    for (const slot of rawSlots) {
      const slotDate = new Date(slot.startUtc);
      // Filter slots outside the allowable booking window
      if (slotDate < earliestBookableUtc || slotDate > latestBookableUtc) {
        continue;
      }

      windowSlotsCount++;
      const deterministicSlotId = `${rules.counselorId}_${slot.startUtc}`;
      if (takenSlotsMap.has(deterministicSlotId)) {
        bookedCount++;
      } else {
        availableCount++;
      }
    }

    let status: DayAvailabilitySummary["status"] = "available";
    if (windowSlotsCount === 0) {
      // All slots on this day are in the past or beyond the 60-day window
      status = "unavailable";
    } else if (availableCount === 0) {
      // Slots existed in window, but ALL of them are booked
      status = "fully_booked";
    } else if (availableCount <= 2) {
      status = "limited";
    } else {
      status = "available";
    }

    results[dateStr] = {
      date: dateStr,
      status,
      availableSlotsCount: availableCount,
      totalSlotsCount: windowSlotsCount,
    };
  }

  return { availability: results, isConfigured };
}

/**
 * Returns available time slot chips for a specific date (YYYY-MM-DD).
 * Output contains ZERO PII.
 */
export async function getDaySlots(dateStr: string): Promise<PublicSlotSummary[]> {
  const rules = await getAvailabilityRules();
  const blockedDates = await getBlockedDates();

  const rawSlots = generateDayRawSlots(dateStr, rules, blockedDates);
  if (rawSlots.length === 0) {
    return [];
  }

  const now = new Date();
  const minAdvanceMillis = (rules.minAdvanceHours || 12) * 60 * 60 * 1000;
  const earliestBookableUtc = new Date(now.getTime() + minAdvanceMillis);
  const maxAdvanceMillis = (rules.bookingWindowDays || 60) * 24 * 60 * 60 * 1000;
  const latestBookableUtc = new Date(now.getTime() + maxAdvanceMillis);

  // Fetch active slots for this day from DB (if credentials available)
  const startOfDayUtc = new Date(parseEatDate(dateStr).getTime() - 4 * 3600 * 1000).toISOString();
  const endOfDayUtc = new Date(parseEatDate(dateStr).getTime() + 32 * 3600 * 1000).toISOString();

  const takenSlotsMap = new Set<string>();

  if (hasAdminCredentials()) {
    try {
      const db = getAdminDb();
      const slotsSnap = await db
        .collection(SLOTS_COLLECTION)
        .where("startUtc", ">=", startOfDayUtc)
        .where("startUtc", "<=", endOfDayUtc)
        .get();

      const nowIso = now.toISOString();
      slotsSnap.docs.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        if (data.status === "active") {
          takenSlotsMap.add(doc.id);
        } else if (data.status === "held" && data.holdExpiresAt && data.holdExpiresAt > nowIso) {
          takenSlotsMap.add(doc.id);
        }
      });
    } catch (err) {
      console.warn("[booking-engine] Error querying day active slots:", err);
    }
  }

  return rawSlots
    .filter((slot) => {
      const slotDate = new Date(slot.startUtc);
      return slotDate >= earliestBookableUtc && slotDate <= latestBookableUtc;
    })
    .map((slot) => {
      const deterministicSlotId = `${rules.counselorId}_${slot.startUtc}`;
      const isAlreadyBooked = takenSlotsMap.has(deterministicSlotId);

      return {
        slotId: deterministicSlotId,
        startUtc: slot.startUtc,
        endUtc: slot.endUtc,
        timeFormatted: slot.timeFormatted,
        isAvailable: !isAlreadyBooked,
        remainingCapacity: !isAlreadyBooked ? 1 : 0,
      };
    });
}

/**
 * ATOMIC BOOKING FUNCTION: Prevents race conditions and double bookings
 * Uses Firestore transaction to check & lock the deterministic slot ID.
 */
export async function bookSlotTransaction(params: {
  slotId: string;
  startUtc: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  sessionType: SessionType;
  deliveryMode: DeliveryMode;
  notes?: string;
}): Promise<Booking> {
  const db = getAdminDb();
  const rules = await getAvailabilityRules();

  // Validate startUtc format
  const startDate = new Date(params.startUtc);
  if (isNaN(startDate.getTime())) {
    throw new Error("INVALID_SLOT: The requested session time is invalid.");
  }

  // Calculate endUtc based on catalog
  const service = SERVICE_DETAILS[params.sessionType] || SERVICE_DETAILS.individual;
  const endUtc = new Date(startDate.getTime() + service.durationMinutes * 60 * 1000).toISOString();

  // Reference codes
  const bookingId = "HC-" + crypto.randomBytes(3).toString("hex").toUpperCase();
  const cancelToken = crypto.randomBytes(24).toString("hex");
  const rescheduleToken = crypto.randomBytes(24).toString("hex");

  // Tokens valid until session start time
  const tokenExpiresAt = params.startUtc;

  // Normalized phone
  let normalizedPhone = params.clientPhone.trim().replace(/\s+/g, "");
  if (normalizedPhone.startsWith("0")) {
    normalizedPhone = "+254" + normalizedPhone.substring(1);
  } else if (normalizedPhone.startsWith("254")) {
    normalizedPhone = "+" + normalizedPhone;
  } else if (!normalizedPhone.startsWith("+")) {
    normalizedPhone = "+254" + normalizedPhone;
  }

  const dateEat = formatToEatDateString(startDate);
  const timeFormatted = formatToEatTimeString(startDate);

  const slotDocRef = db.collection(SLOTS_COLLECTION).doc(params.slotId);
  const bookingDocRef = db.collection(BOOKINGS_COLLECTION).doc(bookingId);
  const cancelTokenRef = db.collection(TOKENS_COLLECTION).doc(`cancel_${cancelToken}`);
  const rescheduleTokenRef = db.collection(TOKENS_COLLECTION).doc(`reschedule_${rescheduleToken}`);

  const nowIso = new Date().toISOString();

  // Run atomic Firestore transaction
  await db.runTransaction(async (transaction: Transaction) => {
    const slotDoc = (await transaction.get(slotDocRef)) as DocumentSnapshot<DocumentData>;

    if (slotDoc.exists) {
      const slotData = slotDoc.data();
      if (slotData?.status === "active") {
        throw new Error("SLOT_TAKEN: That slot was just taken, please pick another.");
      }
      if (
        slotData?.status === "held" &&
        slotData?.holdExpiresAt &&
        slotData.holdExpiresAt > nowIso
      ) {
        throw new Error("SLOT_TAKEN: That slot is currently on temporary hold, please select another time.");
      }
    }

    // Lock slot
    transaction.set(slotDocRef, {
      slotId: params.slotId,
      bookingId,
      counselorId: rules.counselorId,
      startUtc: params.startUtc,
      endUtc,
      status: "active",
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    // Create booking record per Phase 1 schema
    const bookingRecord: Booking = {
      id: bookingId,
      referenceCode: bookingId,
      service: service.name,
      slotId: params.slotId,
      counselorId: rules.counselorId,
      startUtc: params.startUtc,
      endUtc,
      date: dateEat,
      time: timeFormatted,
      timeFormatted,
      client: {
        name: params.clientName.trim(),
        phone: normalizedPhone,
        email: params.clientEmail.trim().toLowerCase(),
        notes: params.notes?.trim() || "",
      },
      // Flat compat aliases (kept so Firestore reads back cleanly on older queries)
      clientName: params.clientName.trim(),
      clientEmail: params.clientEmail.trim().toLowerCase(),
      clientPhone: normalizedPhone,
      notes: params.notes?.trim() || "",
      sessionType: params.sessionType,
      deliveryMode: params.deliveryMode,
      price: service.price,
      currency: "KES",
      status: "confirmed",
      source: "web",
      adminSeen: false,
      cancelToken,
      rescheduleToken,
      tokenExpiresAt,
      paymentStatus: "unpaid",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    transaction.set(bookingDocRef, bookingRecord);

    // Save tokens for secure cancel/reschedule
    transaction.set(cancelTokenRef, {
      type: "cancel",
      bookingId,
      token: cancelToken,
      expiresAt: tokenExpiresAt,
      createdAt: nowIso,
    });

    transaction.set(rescheduleTokenRef, {
      type: "reschedule",
      bookingId,
      token: rescheduleToken,
      expiresAt: tokenExpiresAt,
      createdAt: nowIso,
    });
  });

  return {
    id: bookingId,
    referenceCode: bookingId,
    service: service.name,
    slotId: params.slotId,
    counselorId: rules.counselorId,
    startUtc: params.startUtc,
    endUtc,
    date: dateEat,
    time: timeFormatted,
    timeFormatted,
    client: {
      name: params.clientName.trim(),
      phone: normalizedPhone,
      email: params.clientEmail.trim().toLowerCase(),
      notes: params.notes?.trim() || "",
    },
    clientName: params.clientName.trim(),
    clientEmail: params.clientEmail.trim().toLowerCase(),
    clientPhone: normalizedPhone,
    notes: params.notes?.trim() || "",
    sessionType: params.sessionType,
    deliveryMode: params.deliveryMode,
    price: service.price,
    currency: "KES",
    status: "confirmed",
    source: "web",
    adminSeen: false,
    cancelToken,
    rescheduleToken,
    tokenExpiresAt,
    paymentStatus: "unpaid",
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Cancels a booking using a secure unguessable token
 */
export async function cancelBookingByToken(token: string): Promise<Booking> {
  const db = getAdminDb();
  const tokenDocRef = db.collection(TOKENS_COLLECTION).doc(`cancel_${token}`);
  const tokenDoc = await tokenDocRef.get();

  if (!tokenDoc.exists) {
    throw new Error("INVALID_TOKEN: Cancellation link is invalid or has expired.");
  }

  const { bookingId, expiresAt } = tokenDoc.data() as { bookingId: string; expiresAt: string };
  if (new Date(expiresAt) < new Date()) {
    throw new Error("TOKEN_EXPIRED: Cancellation link has expired.");
  }

  const bookingDocRef = db.collection(BOOKINGS_COLLECTION).doc(bookingId);
  let updatedBooking: Booking | null = null;

  await db.runTransaction(async (transaction: Transaction) => {
    const bSnap = (await transaction.get(bookingDocRef)) as DocumentSnapshot<DocumentData>;
    if (!bSnap.exists) {
      throw new Error("NOT_FOUND: Booking could not be located.");
    }

    const booking = bSnap.data() as Booking;
    if (booking.status === "cancelled") {
      updatedBooking = booking;
      return;
    }

    const slotDocRef = db.collection(SLOTS_COLLECTION).doc(booking.slotId);

    // Release slot
    transaction.delete(slotDocRef);

    // Mark cancelled
    const nowIso = new Date().toISOString();
    transaction.update(bookingDocRef, {
      status: "cancelled",
      updatedAt: nowIso,
    });

    updatedBooking = { ...booking, status: "cancelled", updatedAt: nowIso };
  });

  if (!updatedBooking) throw new Error("CANCELLATION_FAILED");
  return updatedBooking;
}

/**
 * Generates an iCalendar (.ics) string for the session in EAT
 */
export function generateIcsContent(booking: Booking): string {
  const sessionType = booking.sessionType ?? "individual";
  const service = SERVICE_DETAILS[sessionType] ?? SERVICE_DETAILS.individual;

  // Format UTC datetime: YYYYMMDDTHHmmssZ
  const formatIcsDate = (isoStr: string) =>
    isoStr.replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const dtStart = formatIcsDate(booking.startUtc);
  const dtEnd = formatIcsDate(booking.endUtc);
  const dtStamp = formatIcsDate(new Date().toISOString());

  const location =
    booking.deliveryMode === "online"
      ? "Google Meet (Link will be shared ahead of time)"
      : "Hope Counseling Support Services, Nairobi, Kenya";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hope Counseling Support Services//Booking System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.id}@hopecounseling.ke`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Hope Counseling: ${service.name}`,
    `DESCRIPTION:Your confidential therapy session with Hope Counseling Support Services.\\nReference: ${booking.id}\\nMode: ${booking.deliveryMode === "online" ? "Online Video/Call" : "In-Person Clinic"}\\nTime: ${booking.date} at ${booking.timeFormatted} (EAT)`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Hope Counseling session in 2 hours",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
