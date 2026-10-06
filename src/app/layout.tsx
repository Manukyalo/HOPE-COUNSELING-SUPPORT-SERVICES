import type { Metadata } from "next";
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
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hope Counseling Support Services | Nairobi, Kenya",
    description: "A safe, empathetic space for healing and growth. Book a session today.",
    url: "https://hope-counseling-support-services.vercel.app",
    siteName: "Hope Counseling Support Services",
    images: ["/footer.jpeg"],
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${instrumentSerif.variable} ${playfair.variable} ${dmSans.variable} font-inter antialiased bg-[#f9f7f4] text-[#0d2b22]`}>
        <Navbar />
        {children}
        <WhatsAppButton />
        <MobileStickyCTA />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
