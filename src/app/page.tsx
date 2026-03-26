"use client";

import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BookingFlow from "@/components/BookingFlow";
import About from "@/components/About";
import MeetCounselor from "@/components/MeetCounselor";
import ExtraFeatures from "@/components/ExtraFeatures";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f7f4]">
      <Hero />

      <About />

      <MeetCounselor />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <Services />
      </motion.div>

      <ExtraFeatures />

      <BookingFlow />
    </main>
  );
}
