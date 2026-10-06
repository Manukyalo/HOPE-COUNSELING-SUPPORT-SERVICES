import type { Metadata } from "next";

export const viewport = {
  themeColor: "#0d2b22",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
import { Instrument_Serif, Inter, Playfair_Display, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hope-counseling-support-services.vercel.app"),
  title: "Hope Counseling Support Services | Nairobi, Kenya",
  description: "Professional psychological counseling in Nairobi, Kenya. Specializing in stress, anxiety, relationships, youth mentorship, and emotional support.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Hope Counseling Support Services | Nairobi, Kenya",
    description: "A safe, empathetic space for healing and growth. Book a session today.",
    url: "https://hope-counseling-support-services.vercel.app",
    siteName: "Hope Counseling Support Services",
    images: ["/icons/icon-512.png"],
    locale: "en_KE",
    type: "website",
  },
};

import WebsiteShell from "@/components/WebsiteShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${instrumentSerif.variable} ${playfair.variable} ${dmSans.variable} font-inter antialiased bg-[#f9f7f4] text-[#0d2b22]`}>
        <WebsiteShell>{children}</WebsiteShell>
        <Analytics />
      </body>
    </html>
  );
}
