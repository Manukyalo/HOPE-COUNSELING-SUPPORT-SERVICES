import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  getSessionSecret,
  createSessionToken,
  verifySessionToken,
} from "@/lib/admin-auth";
import { getAdminAuth } from "@/lib/firebase-admin";

// Prevent Next.js from statically evaluating this route at build time.
export const dynamic = "force-dynamic";

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Sliding window: max 5 attempts per IP per 15 minutes.
// After 5 failures the IP is locked for 15 minutes.
interface RateLimitEntry {
  count: number;
  lockedUntil: number | null;
  windowStart: number;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

const loginAttempts = new Map<string, RateLimitEntry>();

function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    loginAttempts.set(ip, { count: 0, lockedUntil: null, windowStart: now });
    return { allowed: true };
  }

  if (entry.lockedUntil && now < entry.lockedUntil) {
    return { allowed: false, retryAfterMs: entry.lockedUntil - now };
  }

  // Reset window if expired
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 0, lockedUntil: null, windowStart: now });
    return { allowed: true };
  }

  return { allowed: entry.count < RATE_LIMIT_MAX };
}

function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    loginAttempts.set(ip, { count: 1, lockedUntil: null, windowStart: now });
    return;
  }

  entry.count += 1;
  if (entry.count >= RATE_LIMIT_MAX) {
    entry.lockedUntil = now + LOCK_DURATION_MS;
    console.warn(`[admin/auth] IP ${ip} locked after ${entry.count} failed attempts.`);
  }
  loginAttempts.set(ip, entry);
}

function clearLoginFailures(ip: string): void {
  loginAttempts.delete(ip);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Identical error for wrong-email AND wrong-password — prevents user enumeration */
const INVALID_CREDENTIALS_ERROR = "Invalid credentials. Please try again.";

function unauthorizedResponse(message = INVALID_CREDENTIALS_ERROR) {
  return NextResponse.json(
    { error: message, code: "UNAUTHORIZED", status: 401 },
    { status: 401 }
  );
}

function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

// ─── POST /api/admin/auth — Login ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const secret = getSessionSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Authentication service unavailable.", code: "SERVICE_ERROR" },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);
  const { allowed, retryAfterMs } = checkLoginRateLimit(ip);

  if (!allowed) {
    const retryAfterSec = retryAfterMs ? Math.ceil(retryAfterMs / 1000) : 900;
    return NextResponse.json(
      {
        error: `Too many failed attempts. Please wait ${Math.ceil(retryAfterSec / 60)} minutes before trying again.`,
        code: "RATE_LIMITED",
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body.", code: "BAD_REQUEST" }, { status: 400 });
  }

  const { idToken, pin } = body;

  // ── Path 1: Firebase ID Token (email/password auth via Firebase client SDK) ─
  if (typeof idToken === "string" && idToken.length > 0) {
    try {
      const auth = getAdminAuth();
      const decoded = await auth.verifyIdToken(idToken, /* checkRevoked= */ true);

      // Only allow verified Firebase users with an email
      if (!decoded.email) {
        recordLoginFailure(ip);
        return unauthorizedResponse();
      }

      clearLoginFailures(ip);
      const token = createSessionToken(decoded.email, secret);
      const res = NextResponse.json({ success: true, user: decoded.email }, { status: 200 });
      setSessionCookie(res, token);
      return res;
    } catch (err) {
      console.error("[admin/auth] Firebase token verification failed:", err);
      recordLoginFailure(ip);
      return unauthorizedResponse();
    }
  }

  // ── Path 2: Emergency PIN ─────────────────────────────────────────────────
  if (typeof pin === "string" && pin.length > 0) {
    const adminPin = process.env.ADMIN_PIN;
    if (!adminPin) {
      // PIN auth not configured — fail closed
      return unauthorizedResponse();
    }

    // Timing-safe PIN comparison
    const pinBuf = Buffer.from(pin.trim());
    const adminPinBuf = Buffer.from(adminPin);

    const pinsMatch =
      pinBuf.length === adminPinBuf.length &&
      crypto.timingSafeEqual(pinBuf, adminPinBuf);

    if (!pinsMatch) {
      recordLoginFailure(ip);
      console.warn(`[admin/auth] Failed PIN attempt from IP: ${ip}`);
      return unauthorizedResponse();
    }

    clearLoginFailures(ip);
    const sessionUser = "practitioner@hopecounseling.ke";
    const token = createSessionToken(sessionUser, secret);
    const res = NextResponse.json({ success: true, user: sessionUser }, { status: 200 });
    setSessionCookie(res, token);
    return res;
  }

  // No valid auth method provided
  recordLoginFailure(ip);
  return unauthorizedResponse();
}

// ─── GET /api/admin/auth — Check session ─────────────────────────────────────
export async function GET(req: NextRequest) {
  const secret = getSessionSecret();
  if (!secret) {
    return NextResponse.json(
      { authenticated: false, code: "SERVICE_ERROR" },
      { status: 503 }
    );
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false, code: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = verifySessionToken(token, secret);
  if (!payload) {
    return NextResponse.json({ authenticated: false, code: "UNAUTHORIZED" }, { status: 401 });
  }

  return NextResponse.json(
    { authenticated: true, user: payload.email, expiresAt: payload.exp },
    { status: 200 }
  );
}

// ─── DELETE /api/admin/auth — Logout ─────────────────────────────────────────
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return res;
}
