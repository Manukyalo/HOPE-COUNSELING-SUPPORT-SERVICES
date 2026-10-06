export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type SessionType =
  | "individual"
  | "online"
  | "student"
  | "couples"
  | "initial"
  | "student-pkg"
  | "personal-pkg"
  | "extended-pkg";

export type DeliveryMode = "online" | "in_person";

export interface DaySchedule {
  enabled: boolean;
  start: string; // "09:00" in EAT
  end: string;   // "17:00" in EAT
  breakStart?: string; // "13:00" in EAT
  breakEnd?: string;   // "14:00" in EAT
}

export interface AvailabilityRules {
  counselorId: string;
  sessionDurationMinutes: number; // e.g. 50
  bufferMinutes: number;          // e.g. 10
  sessionsPerSlot: number;        // default 1
  minAdvanceHours: number;        // e.g. 12 (bookable from tomorrow)
  bookingWindowDays: number;      // e.g. 60 days ahead
  timezone: string;               // "Africa/Nairobi" (EAT)
  weeklySchedule: Record<number, DaySchedule>; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  updatedAt: string;
}

export interface BlockedDate {
  id: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  reason: string;
  allDay: boolean;
  startTime?: string; // e.g. "09:00"
  endTime?: string;   // e.g. "13:00"
  createdAt: string;
}

export interface Booking {
  id: string; // e.g. "BK-A7X92"
  slotId: string; // Deterministic: `${counselorId}_${startUtcISO}`
  counselorId: string;
  startUtc: string; // ISO 8601 UTC
  endUtc: string;   // ISO 8601 UTC
  date: string;     // "YYYY-MM-DD" in EAT
  timeFormatted: string; // "09:00" in EAT
  clientName: string;
  clientEmail: string;
  clientPhone: string; // Normalized E.164: "+254701279231"
  sessionType: SessionType;
  deliveryMode: DeliveryMode;
  notes?: string;
  price: number;
  currency: "KES";
  status: BookingStatus;
  cancelToken: string;
  rescheduleToken: string;
  tokenExpiresAt: string; // ISO 8601 UTC
  paymentStatus: "unpaid" | "held" | "paid" | "failed";
  paymentRef?: string;
  paymentCheckoutId?: string;
  reminderSent24h?: boolean;
  reminderSent2h?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSlotSummary {
  slotId: string;
  startUtc: string;
  endUtc: string;
  timeFormatted: string; // e.g. "09:00"
  isAvailable: boolean;
  remainingCapacity: number;
}

export interface DayAvailabilitySummary {
  date: string; // "YYYY-MM-DD"
  status: "available" | "limited" | "fully_booked" | "unavailable";
  availableSlotsCount: number;
  totalSlotsCount: number;
}

export interface BookingCreationRequest {
  slotId: string;
  startUtc: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  sessionType: SessionType;
  deliveryMode: DeliveryMode;
  notes?: string;
  website_hp?: string; // Honeypot field for bot suppression
}

export interface BookingCreationResult {
  success: boolean;
  bookingRef?: string;
  booking?: {
    id: string;
    date: string;
    timeFormatted: string;
    sessionType: SessionType;
    deliveryMode: DeliveryMode;
    price: number;
    currency: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
  };
  cancelUrl?: string;
  rescheduleUrl?: string;
  calendarIcsUrl?: string;
  paymentUrl?: string;
  error?: string;
  code?: string;
}
