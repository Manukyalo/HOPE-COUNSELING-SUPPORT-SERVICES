import { AvailabilityRules, SessionType } from "@/types/booking";

export const TIMEZONE_EAT = "Africa/Nairobi";

export const SERVICE_DETAILS: Record<
  SessionType,
  {
    name: string;
    sub: string;
    price: number;
    durationMinutes: number;
    description: string;
  }
> = {
  individual: {
    name: "Individual Counselling",
    sub: "50–60 min · One-on-one personalized therapy & emotional support",
    price: 1000,
    durationMinutes: 50,
    description: "Confidential one-on-one therapy for anxiety, depression, life transitions, and self-discovery.",
  },
  online: {
    name: "Online Counselling",
    sub: "50–60 min · Confidential remote video or voice session",
    price: 800,
    durationMinutes: 50,
    description: "Secure, tele-mental health session via encrypted Google Meet or phone call from anywhere.",
  },
  student: {
    name: "Student & Young Adult Support",
    sub: "50–60 min · Subsidized rate for academic pressure & growth",
    price: 700,
    durationMinutes: 50,
    description: "Tailored mental health guidance for high school, university, and vocational students.",
  },
  couples: {
    name: "Couples / Relationship Counselling",
    sub: "60 min · Rebuilding communication & mutual understanding",
    price: 1500,
    durationMinutes: 60,
    description: "Constructive mediation for partners navigating conflicts, infidelity, and relationship distress.",
  },
  initial: {
    name: "Initial Consultation",
    sub: "30 min · Gentle discovery session to explore your needs",
    price: 300,
    durationMinutes: 30,
    description: "An affordable, introductory exploration to understand your goals and match support.",
  },
  "student-pkg": {
    name: "Student Wellness Package (4 Sessions)",
    sub: "4 sessions · Complete student support (Save KSh 300)",
    price: 2500,
    durationMinutes: 50,
    description: "Four structured weekly sessions dedicated to stress reduction and academic performance.",
  },
  "personal-pkg": {
    name: "Personal Growth Package (4 Sessions)",
    sub: "4 sessions · Dedicated weekly personal development (Save KSh 400)",
    price: 3600,
    durationMinutes: 50,
    description: "Intensive month-long personal development and cognitive restructuring program.",
  },
  "extended-pkg": {
    name: "Extended Support Package (6 Sessions)",
    sub: "6 sessions · Comprehensive ongoing journey (Save KSh 1,000)",
    price: 5000,
    durationMinutes: 50,
    description: "Comprehensive 6-week therapeutic support for complex emotional healing and recovery.",
  },
};

export const DEFAULT_AVAILABILITY_RULES: AvailabilityRules = {
  counselorId: "hope_primary",
  sessionDurationMinutes: 50,
  bufferMinutes: 10,
  sessionsPerSlot: 1,
  minAdvanceHours: 12, // Bookable from tomorrow / at least 12h advance
  bookingWindowDays: 60, // Bookable up to 60 days ahead
  timezone: TIMEZONE_EAT,
  weeklySchedule: {
    // 0: Sunday (Closed)
    0: { enabled: false, start: "09:00", end: "17:00" },
    // 1: Monday
    1: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    // 2: Tuesday
    2: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    // 3: Wednesday
    3: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    // 4: Thursday
    4: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    // 5: Friday
    5: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    // 6: Saturday
    6: { enabled: true, start: "09:00", end: "14:00" },
  },
  updatedAt: new Date().toISOString(),
};
