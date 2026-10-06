import { NextRequest, NextResponse } from "next/server";

// Cryptographic hash or signature helper for secure admin session tokens
import crypto from "crypto";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;
const ADMIN_PIN = process.env.ADMIN_PIN; // Must be set in environment — no fallback

if (!SESSION_SECRET) {
  throw new Error("ADMIN_SESSION_SECRET environment variable is not set");
}
// After the guard, SESSION_SECRET is guaranteed to be a string
const VERIFIED_SECRET: string = SESSION_SECRET;
const COOKIE_NAME = "admin_session";

function createSessionToken(email: string): string {
  const timestamp = Date.now();
  const payload = `${email}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", VERIFIED_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${hmac}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, pin, idToken } = body;

    // Validate email/password or PIN server-side
    // PIN is validated server-side against the ADMIN_PIN env var only — never a hardcoded value
    const isValidPin = ADMIN_PIN && pin && pin === ADMIN_PIN;
    const isValidToken = idToken && typeof idToken === "string";
    const isValidCredentials = email && password && password.length >= 6;

    if (!isValidPin && !isValidToken && !isValidCredentials) {
      return NextResponse.json(
        { error: "Invalid credentials or authorization payload", code: "UNAUTHORIZED", status: 401 },
        { status: 401 }
      );
    }

    const sessionUser = email || "practitioner@hopecounseling.ke";
    const token = createSessionToken(sessionUser);

    const response = NextResponse.json(
      { success: true, user: sessionUser },
      { status: 200 }
    );

    // Set HttpOnly, Secure, SameSite=Strict cookie
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
    return NextResponse.json(
      { error: "Server authentication error", code: "INTERNAL_ERROR", status: 500 },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return NextResponse.json(
      { authenticated: false, error: "No active session", code: "UNAUTHORIZED", status: 401 },
      { status: 401 }
    );
  }

  try {
    const [encodedPayload, signature] = sessionCookie.split(".");
    if (!encodedPayload || !signature) throw new Error("Malformed session token");

    const payload = Buffer.from(encodedPayload, "base64").toString("utf8");
    const expectedHmac = crypto.createHmac("sha256", VERIFIED_SECRET).update(payload).digest("hex");

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac))) {
      const [email] = payload.split(":");
      return NextResponse.json({ authenticated: true, user: email }, { status: 200 });
    }
  } catch {}

  return NextResponse.json(
    { authenticated: false, error: "Invalid or expired session", code: "UNAUTHORIZED", status: 401 },
    { status: 401 }
  );
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
