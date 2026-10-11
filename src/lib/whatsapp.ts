/**
 * whatsapp.ts
 * Low-level WaAPI client used by server-side routes only.
 * Never import this in a client component.
 */

const WAAPI_BASE = "https://waapi.app/api/v1";

// ─── Phone normalisation ────────────────────────────────────────────────────

/**
 * Converts any Kenya-formatted phone number to 254XXXXXXXXX (no + or spaces).
 * Examples:
 *   0701234567  → 254701234567
 *   +254701234567 → 254701234567
 *   254701234567  → 254701234567
 */
export function normalizePhoneKE(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  // International format without leading zero: treat as-is if already 12 digits
  return digits;
}

/** Converts a normalised number into the WaAPI chatId format. */
function toChatId(normalised: string): string {
  return `${normalised}@c.us`;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type WaSendResult =
  | { ok: true }
  | { ok: false; reason: string };

export type WaStatusResult =
  | { connected: true; instanceId: string }
  | { connected: false; reason: string };

// ─── Core send ───────────────────────────────────────────────────────────────

/**
 * Sends a plain-text WhatsApp message via WaAPI.
 *
 * Returns { ok: true } on success.
 * Returns { ok: false, reason } on any failure — never throws.
 *
 * IMPORTANT: WaAPI may return HTTP 200 with { status: "error" }.
 * We parse the JSON body to confirm real success.
 */
export async function sendWhatsAppText(
  phone: string,
  message: string
): Promise<WaSendResult> {
  const token = process.env.WAAPI_API_TOKEN;
  const instanceId = process.env.WAAPI_INSTANCE_ID;

  if (!token || !instanceId) {
    console.log("[WA:DEV] WaAPI not configured — skipping send to", phone);
    return { ok: false, reason: "WaAPI env vars not configured" };
  }

  const normalised = normalizePhoneKE(phone);
  const chatId = toChatId(normalised);

  const url = `${WAAPI_BASE}/instances/${instanceId}/client/action/send-message`;

  let raw: Response;
  try {
    raw = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, message }),
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error("[WA] Network error sending to", phone, ":", reason);
    return { ok: false, reason: `Network error: ${reason}` };
  }

  let body: unknown;
  try {
    body = await raw.json();
  } catch {
    // Non-JSON response
    if (!raw.ok) {
      return { ok: false, reason: `HTTP ${raw.status}` };
    }
    // 200 with non-JSON body — treat as success
    return { ok: true };
  }

  // WaAPI returns { status: "success" | "error", ... }
  const data = body as Record<string, unknown>;

  if (!raw.ok || data?.status === "error") {
    const reason =
      (data?.message as string) ||
      (data?.error as string) ||
      `HTTP ${raw.status}`;
    console.error("[WA] Send failed for", phone, ":", reason);
    return { ok: false, reason };
  }

  return { ok: true };
}

// ─── Instance status check ───────────────────────────────────────────────────

/**
 * Checks whether the WaAPI instance is currently connected (QR authenticated).
 * Returns { connected: true } or { connected: false, reason }.
 */
export async function checkWaApiStatus(): Promise<WaStatusResult> {
  const token = process.env.WAAPI_API_TOKEN;
  const instanceId = process.env.WAAPI_INSTANCE_ID;

  if (!token || !instanceId) {
    return { connected: false, reason: "WaAPI env vars not configured" };
  }

  const url = `${WAAPI_BASE}/instances/${instanceId}`;

  let raw: Response;
  try {
    raw = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return { connected: false, reason: `Network error: ${reason}` };
  }

  let body: unknown;
  try {
    body = await raw.json();
  } catch {
    return { connected: false, reason: `HTTP ${raw.status} non-JSON response` };
  }

  const data = body as Record<string, unknown>;

  // WaAPI returns instance.status === "authenticated" when connected
  const status =
    (data?.status as string) ||
    ((data?.instance as Record<string, unknown>)?.status as string) ||
    "";

  if (raw.ok && status === "authenticated") {
    return { connected: true, instanceId };
  }

  return {
    connected: false,
    reason: status || `HTTP ${raw.status}`,
  };
}

// ─── Message builders ─────────────────────────────────────────────────────────

/** WhatsApp confirmation message sent to the client after booking. */
export function buildClientConfirmationMessage(booking: {
  referenceCode?: string;
  id?: string;
  date?: string;
  time?: string;
  timeFormatted?: string;
  service?: string;
  sessionType?: string;
  deliveryMode?: string;
  client?: { name?: string };
  clientName?: string;
}): string {
  const name = booking.client?.name || booking.clientName || "there";
  const ref = booking.referenceCode || booking.id || "—";
  const date = booking.date || "your scheduled date";
  const time = booking.timeFormatted || booking.time || "your scheduled time";
  const service = booking.service || booking.sessionType || "counseling session";
  const mode = booking.deliveryMode === "online" ? "online (video call)" : "in-person";

  return (
    `Hello ${name} 👋\n\n` +
    `Your appointment with *Hope Counseling & Support Services* has been confirmed.\n\n` +
    `📅 *Date:* ${date}\n` +
    `🕐 *Time:* ${time} (EAT)\n` +
    `💬 *Session:* ${service} (${mode})\n` +
    `🔖 *Ref:* ${ref}\n\n` +
    `Need to reschedule or have questions? Reply to this message or call/WhatsApp us at *0701 279 231*.\n\n` +
    `We look forward to seeing you. 🌸\n` +
    `— Hope Counseling & Support Services`
  );
}

/** WhatsApp notification message sent to the admin when a new booking arrives. */
export function buildAdminNewBookingMessage(booking: {
  referenceCode?: string;
  id?: string;
  date?: string;
  time?: string;
  timeFormatted?: string;
  service?: string;
  sessionType?: string;
  deliveryMode?: string;
  client?: { name?: string; phone?: string; email?: string };
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  notes?: string;
}): string {
  const name = booking.client?.name || booking.clientName || "Unknown";
  const phone = booking.client?.phone || booking.clientPhone || "—";
  const email = booking.client?.email || booking.clientEmail || "—";
  const ref = booking.referenceCode || booking.id || "—";
  const date = booking.date || "—";
  const time = booking.timeFormatted || booking.time || "—";
  const service = booking.service || booking.sessionType || "—";
  const mode = booking.deliveryMode === "online" ? "Online" : "In-Person";
  const notes = booking.notes ? `\n📝 *Notes:* ${booking.notes}` : "";

  return (
    `🌸 *New Booking — Hope Counseling*\n\n` +
    `👤 *Client:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `📧 *Email:* ${email}\n` +
    `📅 *Date:* ${date}\n` +
    `🕐 *Time:* ${time} (EAT)\n` +
    `💬 *Session:* ${service} (${mode})\n` +
    `🔖 *Ref:* ${ref}` +
    notes
  );
}
