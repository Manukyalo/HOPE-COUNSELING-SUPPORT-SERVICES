import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminPWARegister from "@/components/AdminPWARegister";
import { getSessionSecret, verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Practitioner Portal | Hope Counseling Support Services",
  description:
    "Confidential clinical portal and session management workspace for Hope Counseling Support Services, Nairobi.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HC Admin",
  },
};

export const viewport = {
  themeColor: "#071a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * SERVER-SIDE SECURITY GUARD — Layer 2 (after middleware Layer 1).
 * This server component re-verifies the session before rendering ANY
 * admin UI — middleware alone is not sufficient because it only checks
 * cookie presence, not signature + expiry.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const currentPath = headersList.get("x-admin-pathname") || "";

  // The login page itself must be rendered without authentication
  if (currentPath === "/admin/login") {
    return (
      <div
        className="min-h-screen bg-[#071a14] text-white selection:bg-[#7ecab0] selection:text-[#071a14]"
        data-admin-portal="auth"
      >
        {children}
      </div>
    );
  }

  // Re-verify session on every server render — no caching of auth state
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const secret = getSessionSecret();

  if (!secret || !token || !verifySessionToken(token, secret)) {
    // Redirect to login. Never expose why (no error codes in redirect URL).
    redirect("/admin/login");
  }

  return (
    <div
      className="min-h-screen bg-[#071a14] text-white selection:bg-[#7ecab0] selection:text-[#071a14]"
      // Prevent admin page from being framed
      data-admin-portal="true"
    >
      <AdminPWARegister />
      {children}
    </div>
  );
}
