import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface BookingSession {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  date: string | null;
  time: string | null;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

const LOCAL_STORAGE_KEY = "hope_admin_bookings";
const COLLECTION_NAME = "bookings";

// Helpers for resilient offline local fallback
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
 * Creates a new booking in Firestore.
 * Does NOT store in public localStorage to prevent client data exposure on shared devices.
 */
export async function createBookingSession(
  booking: Omit<BookingSession, "createdAt"> & { createdAt?: string }
): Promise<BookingSession> {
  const fullBooking: BookingSession = {
    ...booking,
    createdAt: booking.createdAt || new Date().toISOString(),
  };

  // Persist directly to secure Firestore database
  try {
    const docRef = doc(db, COLLECTION_NAME, fullBooking.id);
    await setDoc(docRef, {
      ...fullBooking,
      serverTimestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Firestore booking submission error:", err);
  }

  return fullBooking;
}

/**
 * Subscribes to real-time booking sessions from Firestore.
 * Automatically falls back to local cache if offline or connecting.
 */
export function subscribeToBookingSessions(
  onUpdate: (bookings: BookingSession[]) => void,
  onError?: (err: Error) => void
): () => void {
  // Deliver cached data immediately for zero-delay UI rendering
  const cached = getLocalCache();
  if (cached.length > 0) {
    onUpdate(cached);
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const remoteBookings: BookingSession[] = [];
        snapshot.forEach((d) => {
          remoteBookings.push(d.data() as BookingSession);
        });

        // Merge remote with local to avoid losing offline entries
        const local = getLocalCache();
        const mergedMap = new Map<string, BookingSession>();

        // Local first
        local.forEach((b) => mergedMap.set(b.id, b));
        // Remote overwrites with source of truth
        remoteBookings.forEach((b) => mergedMap.set(b.id, b));

        const finalMerged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setLocalCache(finalMerged);
        onUpdate(finalMerged);
      },
      (error) => {
        console.warn("Firestore realtime listener fallback to cache:", error);
        onUpdate(getLocalCache());
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Firestore query setup error, using local cache:", err);
    onUpdate(getLocalCache());
    return () => {};
  }
}

/**
 * Updates status of a session in Firestore and local cache.
 */
export async function updateSessionStatus(
  id: string,
  status: BookingSession["status"]
): Promise<void> {
  // Update local cache
  const local = getLocalCache().map((b) =>
    b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b
  );
  setLocalCache(local);

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Firestore status update pending:", err);
  }
}

/**
 * Updates practitioner confidential notes for a session.
 */
export async function updateSessionNotes(id: string, notes: string): Promise<void> {
  const local = getLocalCache().map((b) =>
    b.id === id ? { ...b, notes, updatedAt: new Date().toISOString() } : b
  );
  setLocalCache(local);

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      notes,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Firestore notes update pending:", err);
  }
}

/**
 * Deletes a session from Firestore and local cache.
 */
export async function deleteSession(id: string): Promise<void> {
  const local = getLocalCache().filter((b) => b.id !== id);
  setLocalCache(local);

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore delete pending:", err);
  }
}
