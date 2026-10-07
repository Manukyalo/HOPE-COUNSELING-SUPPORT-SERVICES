export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
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

export type ClientAgeGroup = "13-17" | "18-24" | "25-39" | "40-59" | "60+" | "prefer_not_to_say";

export interface ClientDetails {
  name: string;
  phone: string; // Kenyan format (+254...)
  email?: string;
  ageGroup?: ClientAgeGroup | string;
  notes?: string;
}

export interface DaySchedule {
  enabled: boolean;
  start: string; // "09:00" in EAT
  end: string;   // "17:00" in EAT
  breakStart?: string; // "13:00" in EAT
  breakEnd?: string;   // "14:00" in EAT
}

export interface AvailabilitySettings {
  workingDays: number[]; // e.g. [1, 2, 3, 4, 5, 6] (1=Monday … 6=Saturday)
  sessionStartHour: string; // "09:00"
  sessionEndHour: string;   // "17:00"
  sessionDurationMinutes: number; // e.g. 50
  bufferMinutes: number; // e.g. 10
  minAdvanceHours?: number; // e.g. 12 (slots bookable at least N hours ahead)
  blockedDates: BlockedDateEntry[];
  bookingWindowDays: number; // 60 days starting tomorrow
  maxBookingsPerSlot: number; // 1
  weeklySchedule: Record<number, DaySchedule>;
  counselorId?: string;
  updatedAt?: string;
}

export interface BlockedDateEntry {
  id?: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  reason: string;
  allDay: boolean;
  startTime?: string; // "09:00"
  endTime?: string;   // "13:00"
  createdAt?: string;
}

export type AvailabilityRules = AvailabilitySettings;
export type BlockedDate = BlockedDateEntry;

export interface Booking {
  id: string; // e.g. "HCS-ABC123"
  referenceCode: string; // e.g. "HCS-ABC123"
  service: string; // service name or sessionType identifier
  date: string; // "YYYY-MM-DD" (EAT)
  time: string; // "HH:mm" (EAT)
  status: BookingStatus;
  client: ClientDetails;
  createdAt: string; // UTC ISO 8601
  updatedAt: string; // UTC ISO 8601
  source: "web" | "admin" | "phone";
  adminSeen: boolean;

  // Additional scheduling metadata
  slotId: string;
  counselorId?: string;
  startUtc: string;
  endUtc: string;
  price?: number;
  currency?: "KES";
  sessionType?: SessionType;
  deliveryMode?: DeliveryMode;
  cancelToken?: string;
  rescheduleToken?: string;
  tokenExpiresAt?: string;
  paymentStatus?: "unpaid" | "held" | "paid" | "failed";
  reminderSent24h?: boolean;
  reminderSent2h?: boolean;

  // Compatibility accessors for existing components
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  notes?: string;
  timeFormatted?: string;
}

export interface SlotLock {
  slotKey: string; // `${date}_${time}`
  bookingId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  startUtc: string;
  createdAt: string;
}

export interface AdminDevice {
  id: string; // FCM registration token or unique ID
  token: string;
  userAgent?: string;
  platform?: string;
  lastSeenAt: string;
  createdAt: string;
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
  slots?: string[]; // Array of "HH:mm" strings
}

export interface BookingCreationRequest {
  service: string; // sessionType or name
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  name: string;
  phone: string;
  email?: string;
  ageGroup?: string;
  notes?: string;
  deliveryMode?: DeliveryMode;
  slotId?: string;
  startUtc?: string;
  website_hp?: string; // Honeypot field
  idempotencyKey?: string;
}

export interface BookingCreationResult {
  success: boolean;
  referenceCode?: string;
  booking?: {
    id: string;
    referenceCode: string;
    service: string;
    sessionType?: SessionType;
    deliveryMode?: DeliveryMode;
    date: string;
    time: string;
    startUtc?: string;
    endUtc?: string;
    price?: number;
    currency?: string;
    client: ClientDetails;
    notes?: string;
  };
  error?: string;
  code?: string;
  cancelUrl?: string;
  rescheduleUrl?: string;
  calendarIcsUrl?: string;
  availableSlots?: PublicSlotSummary[];
}
