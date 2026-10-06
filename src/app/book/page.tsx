import { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Counseling Session | Hope Counseling Support Services",
  description:
    "Schedule a confidential psychological therapy session in Nairobi, Kenya or online. Choose your date, time, and session format in East Africa Time.",
  openGraph: {
    title: "Book a Counseling Session | Hope Counseling",
    description: "Confidential therapy in Nairobi and online. Flexible scheduling in East Africa Time.",
    url: "https://hope-counseling-support-services.vercel.app/book",
  },
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#f9f7f4] pt-8 sm:pt-16">
      <BookingFlow />
    </main>
  );
}
