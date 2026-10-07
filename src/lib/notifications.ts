import { Booking } from "@/types/booking";
import { getAdminDb, getAdminMessaging, hasAdminCredentials } from "@/lib/firebaseAdmin";

/**
 * Sends discreet confirmation SMS to the client via Africa's Talking.
 * Ensures NO clinical or sensitive psychological reason is leaked in the SMS.
 */
export async function sendClientConfirmationSms(booking: Booking): Promise<boolean> {
  const username = process.env.AFRICASTALKING_USERNAME;
  const apiKey = process.env.AFRICASTALKING_API_KEY;
  const senderId = process.env.AFRICASTALKING_SENDER_ID;

  const clientPhone = booking.client?.phone || booking.clientPhone;
  const clientName = booking.client?.name || booking.clientName || "Client";
  const timeFormatted = booking.timeFormatted || booking.time;

  if (!clientPhone) {
    console.warn(`[SMS] Cannot send confirmation SMS: no phone number for booking ${booking.id}`);
    return false;
  }

  if (!username || !apiKey) {
    console.log(
      `[SMS:DEV] Africa's Talking not configured. SMS to ${clientPhone}: "Hello ${clientName}, your appointment with Hope Counseling is confirmed for ${booking.date} at ${timeFormatted} (EAT). Ref: ${booking.referenceCode || booking.id}. Confidentiality is respected."`
    );
    return true;
  }

  const message = `Hello ${clientName}, your appointment with Hope Counseling is confirmed for ${booking.date} at ${timeFormatted} (EAT). Ref: ${booking.referenceCode || booking.id}. Please reach us if you need to adjust your time.`;

  try {
    const url =
      username === "sandbox"
        ? "https://api.sandbox.africastalking.com/version1/messaging"
        : "https://api.africastalking.com/version1/messaging";

    const bodyParams = new URLSearchParams();
    bodyParams.append("username", username);
    bodyParams.append("to", clientPhone);
    bodyParams.append("message", message);
    if (senderId && username !== "sandbox") {
      bodyParams.append("from", senderId);
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        apiKey: apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: bodyParams.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[SMS:AFRICASTALKING] Error response:", errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[SMS:AFRICASTALKING] Network exception sending SMS:", err);
    return false;
  }
}

/**
 * Notifies the counselor/admin of a newly booked appointment.
 */
export async function notifyCounselorNewBooking(booking: Booking): Promise<boolean> {
  const adminPhone = process.env.ADMIN_NOTIFICATION_PHONE || "+254701279231";
  const username = process.env.AFRICASTALKING_USERNAME;
  const apiKey = process.env.AFRICASTALKING_API_KEY;

  const clientName = booking.client?.name || booking.clientName || "Client";
  const sessionType = booking.sessionType || booking.service || "Counseling";
  const deliveryMode = booking.deliveryMode || "in-person";
  const timeFormatted = booking.timeFormatted || booking.time;

  const adminMsg = `[New Booking] ${clientName} booked ${sessionType} (${deliveryMode}) for ${booking.date} at ${timeFormatted} EAT. Ref: ${booking.referenceCode || booking.id}.`;

  if (!username || !apiKey) {
    console.log(`[SMS:ADMIN:DEV] ${adminPhone}: ${adminMsg}`);
    return true;
  }

  try {
    const url =
      username === "sandbox"
        ? "https://api.sandbox.africastalking.com/version1/messaging"
        : "https://api.africastalking.com/version1/messaging";

    const bodyParams = new URLSearchParams();
    bodyParams.append("username", username);
    bodyParams.append("to", adminPhone);
    bodyParams.append("message", adminMsg);

    await fetch(url, {
      method: "POST",
      headers: {
        apiKey: apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: bodyParams.toString(),
    });
    return true;
  } catch (err) {
    console.error("[SMS:ADMIN] Failed notifying counselor:", err);
    return false;
  }
}

/**
 * Sends a reminder SMS (24 hours or 2 hours prior to the session).
 */
export async function sendSessionReminderSms(
  booking: Booking,
  type: "24h" | "2h"
): Promise<boolean> {
  const username = process.env.AFRICASTALKING_USERNAME;
  const apiKey = process.env.AFRICASTALKING_API_KEY;

  const clientPhone = booking.client?.phone || booking.clientPhone;
  const timeFormatted = booking.timeFormatted || booking.time;

  if (!clientPhone) {
    console.warn(`[SMS] Cannot send reminder SMS: no phone number for booking ${booking.id}`);
    return false;
  }

  const timingText = type === "24h" ? "tomorrow" : "in 2 hours";
  const message = `Reminder: Your Hope Counseling session is scheduled for ${timingText} at ${timeFormatted} EAT (Ref: ${booking.referenceCode || booking.id}). We look forward to holding space for you.`;

  if (!username || !apiKey) {
    console.log(`[SMS:REMINDER:DEV] To ${clientPhone}: ${message}`);
    return true;
  }

  try {
    const url =
      username === "sandbox"
        ? "https://api.sandbox.africastalking.com/version1/messaging"
        : "https://api.africastalking.com/version1/messaging";

    const bodyParams = new URLSearchParams();
    bodyParams.append("username", username);
    bodyParams.append("to", clientPhone);
    bodyParams.append("message", message);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        apiKey: apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: bodyParams.toString(),
    });

    return res.ok;
  } catch (e) {
    console.error(`[SMS:REMINDER:${type}] Failed to send reminder:`, e);
    return false;
  }
}

/**
 * Sends a real-time Web Push / FCM notification to all registered admin devices.
 * Uses Firebase Cloud Messaging Admin SDK.
 */
export async function notifyAdminDevices(booking: Booking): Promise<boolean> {
  if (!hasAdminCredentials()) {
    console.log("[PUSH:DEV] Firebase Admin not configured. Skipping FCM push notification.");
    return false;
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection("adminDevices").get();
    if (snap.empty) {
      console.log("[PUSH] No admin devices registered in adminDevices collection.");
      return false;
    }

    const tokens = snap.docs.map((d) => d.data().token).filter(Boolean);
    if (tokens.length === 0) return false;

    const messaging = getAdminMessaging();
    const clientName = booking.client?.name || booking.clientName || "Client";
    const serviceName = booking.service || booking.sessionType || "Counseling Session";
    const timeFormatted = booking.timeFormatted || booking.time;

    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: `🌸 New Booking: ${clientName}`,
        body: `${serviceName} on ${booking.date} at ${timeFormatted} (EAT)`,
      },
      data: {
        bookingId: booking.id,
        referenceCode: booking.referenceCode || booking.id,
        clientName,
        clientPhone: booking.client?.phone || booking.clientPhone || "",
        date: booking.date,
        time: timeFormatted,
        service: serviceName,
        url: "/admin",
      },
    });

    // Cleanup stale tokens if any failed
    if (response.failureCount > 0) {
      const deletePromises: Promise<FirebaseFirestore.WriteResult>[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error?.code === "messaging/registration-token-not-registered") {
          const docId = snap.docs[idx].id;
          deletePromises.push(db.collection("adminDevices").doc(docId).delete());
        }
      });
      await Promise.allSettled(deletePromises);
    }

    return true;
  } catch (err) {
    console.error("[PUSH] Error sending push notification to admin devices:", err);
    return false;
  }
}
