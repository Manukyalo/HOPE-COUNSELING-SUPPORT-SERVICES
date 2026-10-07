import { NextRequest } from "next/server";
import crypto from "crypto";

export const COOKIE_NAME = "admin_session";
const MIN_SECRET_LENGTH = 32;
/** Session lifetime: 8 hours */
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export interface AdminSessionPayload {
  email: string;
  role: "admin";
  iat: number; // issued-at (ms)
  exp: number; // expires-at (ms)
}

/**
 * Reads and validates ADMIN_SESSION_SECRET.
 * Fails closed: returns null if missing, short, or empty.
 */
export function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    console.error(
      "[admin-auth] ADMIN_SESSION_SECRET is missing or shorter than " +
        MIN_SECRET_LENGTH +
        " chars. Admin auth disabled."
    );
    return null;
  }
  return secret;
}

/**
 * Creates a signed, time-limited session token.
 * Format: base64url(JSON payload) + "." + hex(HMAC-SHA256)
 */
export function createSessionToken(email: string, secret: string): string {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    email,
    role: "admin",
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");
  return `${encodedPayload}.${sig}`;
}

/**
 * Verifies a session token.
 * Checks: structure, HMAC signature (timing-safe), expiry, role claim.
 * Returns the payload if valid, null otherwise.
 * Fails closed on ANY error.
 */
export function verifySessionToken(
  token: string,
  secret: string
): AdminSessionPayload | null {
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx < 1) return null;

    const encodedPayload = token.slice(0, dotIdx);
    const providedSig = token.slice(dotIdx + 1);

    if (!encodedPayload || !providedSig) return null;

    // Compute expected HMAC
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(encodedPayload)
      .digest("hex");

    // Timing-safe compare — both buffers MUST be same length (hex digest is always 64 chars)
    const providedBuf = Buffer.from(providedSig.padEnd(64, "0"), "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");

    if (providedBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

    // Recheck after passing sig: provided sig must actually be 64 hex chars
    if (providedSig.length !== 64) return null;

    // Decode and parse payload
    const raw = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as AdminSessionPayload;

    // Validate required fields
    if (
      typeof parsed.email !== "string" ||
      parsed.email.length === 0 ||
      parsed.role !== "admin" ||
      typeof parsed.exp !== "number" ||
      typeof parsed.iat !== "number"
    ) {
      return null;
    }

    // Check expiry
    if (Date.now() > parsed.exp) {
      return null; // expired
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Verifies the admin session from an incoming Next.js request.
 * Returns the session payload if valid, null otherwise.
 * This is the single source of truth for all API route guards.
 */
export function verifyAdminSession(req: NextRequest): AdminSessionPayload | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  return verifySessionToken(token, secret);
}

/**
 * Convenience wrapper: returns just the email or null.
 * Kept for backward-compat with existing callers — prefer verifyAdminSession.
 */
export function verifyAdminSessionEmail(req: NextRequest): string | null {
  return verifyAdminSession(req)?.email ?? null;
}

/**
 * Verifies admin request via either signed httpOnly session cookie or Bearer Firebase ID token.
 */
export async function verifyAdmin(req: NextRequest): Promise<AdminSessionPayload | null> {
  // 1. Try session cookie first
  const cookieSession = verifyAdminSession(req);
  if (cookieSession) return cookieSession;

  // 2. Fall back to Firebase ID token in Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const idToken = authHeader.substring(7).trim();
    if (idToken) {
      try {
        const { getAdminAuth } = await import("./firebaseAdmin");
        const adminAuth = getAdminAuth();
        const decoded = await adminAuth.verifyIdToken(idToken);
        if (decoded?.email) {
          return {
            email: decoded.email,
            role: "admin",
            iat: (decoded.auth_time || 0) * 1000,
            exp: (decoded.exp || 0) * 1000,
          };
        }
      } catch (err) {
        console.warn("[admin-auth] Bearer token verification failed:", err);
      }
    }
  }

  return null;
}
