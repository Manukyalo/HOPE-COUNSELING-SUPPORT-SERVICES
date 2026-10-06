import { NextRequest } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const MIN_SECRET_LENGTH = 32;

/**
 * Validates admin session cookie server-side at request time.
 * Returns the admin email if valid, or null if unauthorized/missing.
 */
export function verifyAdminSession(req: NextRequest): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    console.error("[admin-auth] ADMIN_SESSION_SECRET is missing or invalid");
    return null;
  }

  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const [encodedPayload, signature] = sessionCookie.split(".");
    if (!encodedPayload || !signature) return null;

    const payload = Buffer.from(encodedPayload, "base64").toString("utf8");
    const expectedHmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedHmac);

    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    const [email] = payload.split(":");
    return email ?? null;
  } catch {
    return null;
  }
}
