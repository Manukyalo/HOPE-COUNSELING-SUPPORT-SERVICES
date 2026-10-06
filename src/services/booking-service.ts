import { AvailabilityRules, BlockedDate } from "@/types/booking";

export type BookingSessionStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "no_show";

export interface BookingSession {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  sessionType?: string;
  deliveryMode?: string;
  date: string | null;
  time: string | null;
  timeFormatted?: string | null;
  price?: number;
  currency?: string;
  status: BookingSessionStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

const LOCAL_STORAGE_KEY = "hope_admin_bookings";

function getLocalCache(): BookingSession[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setLocalCache(data: BookingSession[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
}

/**
 * Normalizes booking record from server API
 */
function normalizeSession(b: Record<string, unknown>): BookingSession {
  const rawStatus = (b.status as string) || "Pending";
  // Capitalize for compatibility with existing admin UI
  let status: BookingSession["status"] = "Pending";
  const lower = rawStatus.toLowerCase();
  if (lower === "confirmed") status = "Confirmed";
  else if (lower === "completed") status = "Completed";
  else if (lower === "cancelled") status = "Cancelled";
  else if (lower === "no_show") status = "no_show";

  return {
    id: (b.id as string) || "",
    clientName: (b.clientName as string) || "Anonymous",
    email: (b.clientEmail || b.email || "") as string,
    phone: (b.clientPhone || b.phone || "") as string,
    serviceId: (b.serviceId || b.sessionType || "individual") as string,
    serviceName: (b.serviceName || b.sessionType || "Individual Counselling") as string,
    sessionType: (b.sessionType || "individual") as string,
    deliveryMode: (b.deliveryMode || "online") as string,
    date: (b.date as string) || null,
    time: (b.timeFormatted || b.time || "") as string,
    timeFormatted: (b.timeFormatted || b.time || "") as string,
    price: typeof b.price === "number" ? b.price : 1000,
    currency: (b.currency as string) || "KES",
    status,
    notes: (b.notes as string) || "",
    createdAt: (b.createdAt as string) || new Date().toISOString(),
    updatedAt: (b.updatedAt as string) || undefined,
  };
}

/**
 * Fetches bookings list from server API (protected by admin session cookie)
 */
export async function fetchAdminBookings(status = "all", search = ""): Promise<BookingSession[]> {
  try {
    const params = new URLSearchParams();
    if (status && status !== "all") params.append("status", status.toLowerCase());
    if (search) params.append("search", search);

    const res = await fetch(`/api/admin/bookings?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.bookings && Array.isArray(data.bookings)) {
      const normalized = data.bookings.map(normalizeSession);
      setLocalCache(normalized);
      return normalized;
    }
    return getLocalCache();
  } catch (err) {
    console.warn("[booking-service] API fetch failed, falling back to cache:", err);
    return getLocalCache();
  }
}

/**
 * Subscribes to booking updates using an efficient polling interval
 */
export function subscribeToBookingSessions(
  onUpdate: (bookings: BookingSession[]) => void,
  onError?: (err: Error) => void
): () => void {
  // Provide cached data immediately
  const cached = getLocalCache();
  if (cached.length > 0) {
    onUpdate(cached);
  }

  let active = true;

  const load = async () => {
    try {
      const bookings = await fetchAdminBookings();
      if (active) onUpdate(bookings);
    } catch (e) {
      if (onError) onError(e as Error);
    }
  };

  load();
  const intervalId = setInterval(load, 8000); // Poll every 8s

  return () => {
    active = false;
    clearInterval(intervalId);
  };
}

/**
 * Updates session status via server route
 */
export async function updateSessionStatus(
  id: string,
  status: BookingSession["status"]
): Promise<void> {
  const local = getLocalCache().map((b) =>
    b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b
  );
  setLocalCache(local);

  try {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id, status: status.toLowerCase() }),
    });
    if (!res.ok) {
      console.warn("[booking-service] Server rejected status update:", await res.text());
    }
  } catch (err) {
    console.warn("[booking-service] Status update network error:", err);
  }
}

/**
 * Updates session notes via server route
 */
export async function updateSessionNotes(id: string, notes: string): Promise<void> {
  const local = getLocalCache().map((b) =>
    b.id === id ? { ...b, notes, updatedAt: new Date().toISOString() } : b
  );
  setLocalCache(local);

  try {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id, notes }),
    });
    if (!res.ok) {
      console.warn("[booking-service] Server rejected notes update:", await res.text());
    }
  } catch (err) {
    console.warn("[booking-service] Notes update network error:", err);
  }
}

/**
 * Deletes or cancels session via server route
 */
export async function deleteSession(id: string): Promise<void> {
  await updateSessionStatus(id, "Cancelled");
}

/**
 * Availability & Blocked Dates Admin APIs
 */
export async function fetchAvailabilitySettings(): Promise<{
  rules: AvailabilityRules | null;
  blockedDates: BlockedDate[];
}> {
  try {
    const res = await fetch("/api/admin/availability");
    if (!res.ok) throw new Error("Failed to fetch availability");
    const data = await res.json();
    return { rules: data.rules || null, blockedDates: data.blockedDates || [] };
  } catch (err) {
    console.error("[booking-service] fetchAvailabilitySettings error:", err);
    return { rules: null, blockedDates: [] };
  }
}

export async function saveAvailabilityRules(rules: AvailabilityRules): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_rules", rules }),
    });
    return res.ok;
  } catch (err) {
    console.error("[booking-service] saveAvailabilityRules error:", err);
    return false;
  }
}

export async function addBlockedDate(blockedDate: {
  startDate: string;
  endDate: string;
  reason: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
}): Promise<BlockedDate | null> {
  try {
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_blocked_date", blockedDate }),
    });
    const data = await res.json();
    return data.blockedDate || null;
  } catch (err) {
    console.error("[booking-service] addBlockedDate error:", err);
    return null;
  }
}

export async function deleteBlockedDate(blockedDateId: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_blocked_date", blockedDateId }),
    });
    return res.ok;
  } catch (err) {
    console.error("[booking-service] deleteBlockedDate error:", err);
    return false;
  }
}
