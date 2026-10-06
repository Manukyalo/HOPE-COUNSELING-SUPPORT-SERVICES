import ApproachContent from "@/components/ApproachContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Counseling Approach | Hope Counseling Support Services",
  description: "Learn how Hope Counseling uses empathy-first, evidence-based methods including CBT and mindfulness to guide your personal growth journey in Nairobi, Kenya.",
  openGraph: {
    title: "Our Approach to Healing | Hope Counseling",
    description: "Empathy-first counseling built on trust, science, and genuine human connection. Based in Nairobi, Kenya.",
    url: "https://hope-counseling-support-services.vercel.app/approach",
    images: ["/footer.jpeg"],
  },
  alternates: {
    canonical: "/approach",
  },
};

export default function ApproachPage() {
  return <ApproachContent />;
}
