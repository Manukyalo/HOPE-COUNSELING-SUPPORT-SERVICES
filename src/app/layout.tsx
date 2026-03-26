import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";

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
  title: "Hope Counseling Support Services | Thika, Kenya",
  description: "Professional psychological counseling in Thika, Kenya. Specializing in stress, anxiety, relationships, youth mentorship, and emotional support.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased bg-[#f9f7f4] text-[#0d2b22]`}>
        <Navbar />
        {children}
        <WhatsAppButton />
        <MobileStickyCTA />
        <Footer />
      </body>
    </html>
);
}
