import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// PWA assets that Google's WebAPK build server fetches WITHOUT cookies.
// These must always return 200 with no auth redirect.
const PWA_PUBLIC_PATHS = new Set([
  "/admin-manifest.json",
  "/admin-sw.js",
  "/offline",
]);

const PWA_PUBLIC_PREFIXES = ["/icons/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Always pass PWA assets through — no auth, no redirect ──────────────
  if (
    PWA_PUBLIC_PATHS.has(pathname) ||
    PWA_PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  // ── 2. Block legacy public manifest / service worker (404) ────────────────
  if (
    pathname === "/manifest.json" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js"
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // ── 3. Admin page auth ────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    // Login page itself is always public
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("admin_session")?.value;
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 4. Admin API auth ─────────────────────────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/auth") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("admin_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED", status: 401 },
        { status: 401 }
      );
    }
  }

  // ── 5. Security headers on everything else ────────────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  // Match admin routes, API, and legacy SW/manifest paths
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/manifest.json",
    "/manifest.webmanifest",
    "/sw.js",
    // Also run middleware on these so the explicit allow above fires
    "/admin-manifest.json",
    "/admin-sw.js",
    "/icons/:path*",
    "/offline",
  ],
};
