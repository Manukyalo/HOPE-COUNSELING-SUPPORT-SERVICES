import CinematicHero from "@/components/CinematicHero";
import Services from "@/components/Services";
import BookingFlow from "@/components/BookingFlow";
import About from "@/components/About";
import MeetCounselor from "@/components/MeetCounselor";
import ExtraFeatures from "@/components/ExtraFeatures";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "Hope Counseling Support Services | Mental Wellness & Therapy in Thika, Kenya",
  description: "Professional psychological counseling in Thika, Kenya. Specializing in stress, anxiety, relationships, youth mentorship, and emotional support. Book your free first session today.",
  openGraph: {
    title: "Hope Counseling Support Services",
    description: "A safe space for mental wellness in Thika, Kenya. Expert counseling for stress, anxiety, relationships, and youth development.",
    url: "https://hope-counseling-support-services.vercel.app/",
    siteName: "Hope Counseling",
    images: [
      {
        url: "/ma.jpeg",
        width: 1200,
        height: 630,
        alt: "Hope Counseling Support Services",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Counseling Support Services",
    description: "Professional mental wellness counseling in Thika, Kenya.",
    images: ["/ma.jpeg"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hope Counseling Support Services",
    "description": "Professional psychological counseling in Thika, Kenya",
    "url": "https://hope-counseling-support-services.vercel.app/",
    "telephone": "+254701279231",
    "email": "amayakari5924@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Thika",
      "addressCountry": "KE"
    },
    "openingHours": "Mo-Fr 08:00-17:00",
    "priceRange": "KES",
    "sameAs": [
      "https://wa.me/254701279231"
    ]
  };

  return (
    <main className="min-h-screen bg-[#f9f7f4]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CinematicHero />

      <About />

      <MeetCounselor />

      <Services />

      <ExtraFeatures />

      <BookingFlow />
    </main>
  );
}
