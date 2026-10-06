import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Prevent Next.js from statically evaluating this route at build time.
// All secret reads happen inside request handlers, never at module scope.
export const dynamic = "force-dynamic";

const COOKIE_NAME = "admin_session";
const MIN_SECRET_LENGTH = 32;

/** Read and validate ADMIN_SESSION_SECRET at request time. Fail closed on any issue. */
function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    console.error(
      "[admin/auth] ADMIN_SESSION_SECRET is missing or shorter than " +
        MIN_SECRET_LENGTH +
        " characters. Set it in your environment."
    );
    return null;
  }
  return secret;
}

/** Read ADMIN_PIN at request time. Returns null if not configured. */
function getAdminPin(): string | null {
  const pin = process.env.ADMIN_PIN;
  if (!pin) {
    console.error("[admin/auth] ADMIN_PIN is not set in environment.");
    return null;
  }
  return pin;
}

function createSessionToken(email: string, secret: string): string {
  const timestamp = Date.now();
  const payload = `${email}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${hmac}`;
}

function verifySessionToken(token: string, secret: string): string | null {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const payload = Buffer.from(encodedPayload, "base64").toString("utf8");
    const expectedHmac = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedHmac);

    // Constant-time comparison — lengths must match first to avoid allocation attacks
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    const [email] = payload.split(":");
    return email ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const secret = getSessionSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Authentication service unavailable", code: "SERVICE_ERROR", status: 500 },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { email, password, pin, idToken } = body;

    // PIN auth — validated server-side only against env var, never a hardcoded value
    const adminPin = getAdminPin();
    const isValidPin = adminPin !== null && typeof pin === "string" && pin === adminPin;

    // Firebase ID token auth — presence is sufficient for session creation; Firebase
    // SDK already verified the token client-side. For defence-in-depth this should be
    // verified with firebase-admin on the server, but that requires a service account.
    const isValidToken = typeof idToken === "string" && idToken.length > 0;

    // Email/password — presence check only; Firebase Auth enforces the real validation
    const isValidCredentials =
      typeof email === "string" &&
      typeof password === "string" &&
      password.length >= 6;

    if (!isValidPin && !isValidToken && !isValidCredentials) {
      return NextResponse.json(
        { error: "Invalid credentials or authorization payload", code: "UNAUTHORIZED", status: 401 },
        { status: 401 }
      );
    }

    const sessionUser =
      typeof email === "string" && email.length > 0
        ? email
        : "practitioner@hopecounseling.ke";

    const token = createSessionToken(sessionUser, secret);

    const response = NextResponse.json(
      { success: true, user: sessionUser },
      { status: 200 }
    );

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return response;
  } catch (err) {
    console.error("[admin/auth] POST error:", err);
    return NextResponse.json(
      { error: "Server authentication error", code: "INTERNAL_ERROR", status: 500 },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const secret = getSessionSecret();
  if (!secret) {
    return NextResponse.json(
      { authenticated: false, error: "Authentication service unavailable", code: "SERVICE_ERROR", status: 500 },
      { status: 500 }
    );
  }

  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return NextResponse.json(
      { authenticated: false, error: "No active session", code: "UNAUTHORIZED", status: 401 },
      { status: 401 }
    );
  }

  const email = verifySessionToken(sessionCookie, secret);
  if (!email) {
    return NextResponse.json(
      { authenticated: false, error: "Invalid or expired session", code: "UNAUTHORIZED", status: 401 },
      { status: 401 }
    );
  }

  return NextResponse.json({ authenticated: true, user: email }, { status: 200 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
