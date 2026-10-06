// Utility for sending native Web & Service Worker notifications to device

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

/**
 * Requests browser permission for notifications.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error("Error requesting notification permission:", error);
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
 * Sends a native system notification to the admin's device (desktop or mobile).
 * Contains full booking details: Name, Service, Date, Time, Contact.
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

  // Preferred: Show via Service Worker Registration (supports vibration & background click-to-open)
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await (reg.showNotification as (title: string, options?: unknown) => Promise<void>)(title, {
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
        });
        return;
      }
    } catch (e) {
      console.warn("ServiceWorker notification failed, falling back to Notification constructor:", e);
    }
  }

  // Fallback: Desktop / standard Notification object
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
    console.warn("Standard notification constructor failed:", e);
  }
}
