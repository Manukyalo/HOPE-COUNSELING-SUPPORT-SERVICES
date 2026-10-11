import { NextRequest, NextResponse } from "next/server";
import { checkWaApiStatus } from "@/lib/whatsapp";
import { verifyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/whatsapp/status
 * Admin-only: checks whether the WaAPI instance is authenticated (QR connected).
 */
export async function GET(req: NextRequest) {
  const session = verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await checkWaApiStatus();
  return NextResponse.json(result);
}
