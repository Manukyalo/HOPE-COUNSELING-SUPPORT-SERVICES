import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practitioner Portal | Hope Counseling Support Services",
  description: "Confidential clinical portal and session management workspace for Hope Counseling Support Services, Nairobi.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/admin-manifest.json",
};

export const viewport = {
  themeColor: "#0a221b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#071a14] text-white selection:bg-[#7ecab0] selection:text-[#071a14]">{children}</div>;
}
