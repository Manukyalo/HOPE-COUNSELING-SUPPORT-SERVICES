// FCM Push Notifications & Service Worker Management for Admin PWA
import { app } from "@/lib/firebase";

export interface BookingNotificationPayload {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  date: string | null;
  time: string | null;
}

export interface AdminDeviceRecord {
  id: string;
  tokenSnippet: string;
  platform: string;
  userAgent: string;
  createdAt: string | null;
  lastSeenAt: string | null;
  adminEmail: string;
}

export interface TestPushResult {
  id: string;
  tokenSnippet: string;
  userAgent: string;
  status: "sent" | "failed";
  errorCode?: string;
  errorMessage?: string;
}

interface ExtendedNotificationOptions extends NotificationOptions {
  renotify?: boolean;
  vibrate?: number[];
}

/**
 * Registers an admin device token with the server to receive push notifications.
 */
export async function registerAdminDevice(token: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        platform: typeof navigator !== "undefined" ? navigator.platform || "web" : "web",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "browser",
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[pwa-notifications] Error registering admin device token:", err);
    return false;
  }
}

/**
 * Fetches all currently registered admin devices.
 */
export async function fetchAdminDevices(): Promise<AdminDeviceRecord[]> {
  try {
    const res = await fetch("/api/admin/devices");
    if (!res.ok) return [];
    const data = await res.json();
    return data.devices || [];
  } catch (err) {
    console.error("[pwa-notifications] Error fetching admin devices:", err);
    return [];
  }
}

/**
 * Unregisters an admin device.
 */
export async function deleteAdminDevice(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/devices?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (err) {
    console.error("[pwa-notifications] Error deleting admin device:", err);
    return false;
  }
}

/**
 * Triggers server-side test multicast push to all registered admin devices.
 */
export async function sendTestPushNotification(): Promise<{
  success: boolean;
  message: string;
  results: TestPushResult[];
}> {
  try {
    const res = await fetch("/api/admin/push/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return {
      success: Boolean(data.success),
      message: data.message || (data.success ? "Test push sent" : "Test push failed"),
      results: data.results || [],
    };
  } catch (err) {
    return {
      success: false,
      message: "Network error sending test notification",
      results: [],
    };
  }
}

/**
 * Initializes FCM messaging and registers the admin device token.
 */
export async function syncAdminPushDeviceToken(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  if (Notification.permission !== "granted") {
    return null;
  }

  try {
    const { getMessaging, getToken, onMessage, isSupported } = await import("firebase/messaging");
    const supported = await isSupported();
    if (!supported) {
      console.warn("[pwa-notifications] FCM is not supported in this browser environment.");
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      return null;
    }

    // Register /firebase-messaging-sw.js for background push
    const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    const messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration: swReg,
    });

    if (currentToken) {
      localStorage.setItem("hc_fcm_token", currentToken);
      await registerAdminDevice(currentToken);

      // Listen for foreground messages while admin dashboard is open
      onMessage(messaging, (payload) => {
        const title = payload.notification?.title || "🌸 New Booking";
        const body = payload.notification?.body || "A new client session was booked.";

        // Dispatch local custom event for live dashboard banner
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("hope:fcm-foreground-message", { detail: payload })
          );
        }

        // Show local browser notification if permitted
        if (Notification.permission === "granted" && swReg.showNotification) {
          const swOpts: ExtendedNotificationOptions = {
            body,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            tag: payload.data?.bookingId || "new-booking",
            renotify: true,
            data: { url: "/admin" },
          };
          swReg.showNotification(title, swOpts);
        }
      });

      return currentToken;
    }

    return null;
  } catch (err) {
    console.error("[pwa-notifications] Error synchronizing FCM device token:", err);
    return null;
  }
}

/**
 * Requests browser permission for notifications and initializes FCM.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await syncAdminPushDeviceToken();
    }
    return permission;
  } catch (error) {
    console.error("[pwa-notifications] Error requesting notification permission:", error);
    return "denied";
  }
}

/**
 * Checks if notification permission is granted.
 */
export function isNotificationGranted(): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  return Notification.permission === "granted";
}

/**
 * Sends a local fallback notification if service worker is active.
 */
export async function sendBookingNotification(booking: BookingNotificationPayload) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const title = `🌸 New Booking: ${booking.clientName}`;
  const dateStr = booking.date ? `${booking.date} (${booking.time || "TBD"})` : "Flexible Date";
  const contactStr = [booking.phone, booking.email].filter(Boolean).join(" · ");
  const body = `Session: ${booking.serviceName}\n📅 ${dateStr}\n📞 ${contactStr}`;

  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        const swOpts: ExtendedNotificationOptions = {
          body,
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          vibrate: [200, 100, 200, 100, 200],
          tag: booking.id,
          renotify: true,
          data: {
            url: "/admin",
            bookingId: booking.id,
          },
        };
        await reg.showNotification(title, swOpts);
        return;
      }
    } catch (e) {
      console.warn("[pwa-notifications] SW notification failed:", e);
    }
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: booking.id,
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = "/admin";
    };
  } catch (e) {
    console.warn("[pwa-notifications] Fallback Notification failed:", e);
  }
}
