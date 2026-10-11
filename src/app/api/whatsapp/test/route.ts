import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { sendWhatsAppText, normalizePhoneKE } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/whatsapp/test
 * Admin-only: sends a test WhatsApp message to the admin phone to verify the WaAPI
 * instance is connected and delivering messages.
 */
export async function POST(req: NextRequest) {
  const session = verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminPhone = normalizePhoneKE("0701279231");
  const message =
    `🔔 *Hope Counseling — WaAPI Test*\n\n` +
    `This is a test message triggered by the admin dashboard.\n` +
    `Sent by: ${session.email}\n` +
    `Time: ${new Date().toISOString()}\n\n` +
    `If you received this, WhatsApp notifications are working correctly. ✅`;

  const result = await sendWhatsAppText(adminPhone, message);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason, code: "WA_FAILED" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
