import { AvailabilityRules, BlockedDate } from "@/types/booking";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export type BookingSessionStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "no_show";

export interface BookingSession {
  id: string;
  referenceCode?: string;
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
  adminSeen?: boolean;
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
 * Normalizes booking record from server API or Firestore document snapshot
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

  const clientObj = (b.client as Record<string, unknown>) || {};
  const clientName = (clientObj.name as string) || (b.clientName as string) || "Anonymous";
  const email = (clientObj.email as string) || (b.clientEmail as string) || (b.email as string) || "";
  const phone = (clientObj.phone as string) || (b.clientPhone as string) || (b.phone as string) || "";
  const notes = (b.notes as string) || (clientObj.notes as string) || "";
  const referenceCode = (b.referenceCode as string) || (b.id as string) || "";
  const adminSeen = b.adminSeen !== false; // defaults to true unless explicitly false

  return {
    id: (b.id as string) || "",
    referenceCode,
    clientName,
    email,
    phone,
    serviceId: (b.serviceId || b.sessionType || "individual") as string,
    serviceName: (b.service as string) || (b.serviceName as string) || (b.sessionType as string) || "Individual Counselling",
    sessionType: (b.sessionType || "individual") as string,
    deliveryMode: (b.deliveryMode || "online") as string,
    date: (b.date as string) || null,
    time: (b.timeFormatted || b.time || "") as string,
    timeFormatted: (b.timeFormatted || b.time || "") as string,
    price: typeof b.price === "number" ? b.price : 1000,
    currency: (b.currency as string) || "KES",
    status,
    adminSeen: b.adminSeen === true ? true : (b.adminSeen === false ? false : true),
    notes,
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

    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/bookings?${params.toString()}`, {
      cache: "no-store",
      headers,
    });
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
 * Subscribes to booking updates using live Firestore onSnapshot with fallback polling
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
  let unsubscribeFirestore: (() => void) | null = null;
  let pollingIntervalId: NodeJS.Timeout | null = null;

  const startPolling = () => {
    if (pollingIntervalId || !active) return;
    const load = async () => {
      try {
        const bookings = await fetchAdminBookings();
        if (active) onUpdate(bookings);
      } catch (e) {
        if (onError) onError(e as Error);
      }
    };
    load();
    pollingIntervalId = setInterval(load, 8000);
  };

  // Attach Firestore live onSnapshot listener
  try {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        if (!active) return;
        const list: BookingSession[] = [];
        snapshot.forEach((docSnap) => {
          list.push(normalizeSession({ id: docSnap.id, ...docSnap.data() }));
        });
        setLocalCache(list);
        onUpdate(list);
      },
      (error) => {
        console.warn("[booking-service] Firestore onSnapshot fallback to polling:", error.message);
        startPolling();
      }
    );
  } catch (err) {
    console.warn("[booking-service] onSnapshot initialization error, fallback to polling:", err);
    startPolling();
  }

  return () => {
    active = false;
    if (unsubscribeFirestore) unsubscribeFirestore();
    if (pollingIntervalId) clearInterval(pollingIntervalId);
  };
}

/**
 * Marks a booking session as seen by admin to clear the "NEW" badge
 */
export async function markSessionSeen(id: string): Promise<void> {
  const local = getLocalCache().map((b) =>
    b.id === id ? { ...b, adminSeen: true } : b
  );
  setLocalCache(local);

  try {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id, adminSeen: true }),
    });
  } catch (err) {
    console.warn("[booking-service] markSessionSeen error:", err);
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  try {
    if (typeof window !== "undefined" && auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // If getting Firebase token fails, server checks httpOnly session cookie
  }
  return headers;
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
    const headers = await getAuthHeaders();
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers,
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
    const headers = await getAuthHeaders();
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers,
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
 * Permanently deletes session from Firestore via server route and cleans local cache
 */
export async function deleteSession(id: string): Promise<boolean> {
  // Purge from local cache immediately
  const local = getLocalCache().filter((b) => b.id !== id && b.referenceCode !== id);
  setLocalCache(local);

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ bookingId: id }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn("[booking-service] Server rejected delete:", errText);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[booking-service] Delete network error:", err);
    return false;
  }
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
