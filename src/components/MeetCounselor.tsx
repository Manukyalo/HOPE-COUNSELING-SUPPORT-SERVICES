"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const badges = ["Certified Counselor", "CBT Trained", "Confidential"];
const stats = ["10+ Fields of Expertise", "Free First Session"];

export default function MeetCounselor() {
  return (
    <section className="py-20 md:py-32 bg-[#f9f7f4] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column - Photo */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[45%] relative"
          >
            {/* Decorative Shadow Element */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#7ecab0] opacity-10 rounded-[20px] pointer-events-none" />
            
            <div className="relative aspect-[4/5] w-full rounded-[20px] overflow-hidden shadow-sm">
              <Image
                src="/ma.jpeg"
                alt="Maryann Wangari"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              {badges.map((badge) => (
                <span 
                  key={badge}
                  className="px-3 py-1 bg-[#e8f5f0] text-[#2d6e5a] text-[10px] font-sans font-medium rounded-full tracking-wide"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="w-full lg:w-[55%] text-left"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-4 block font-medium">
              Your Counselor
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#0d2b22] mb-2 leading-tight">
              Maryann Wangari
            </h2>
            <p className="font-sans text-sm text-[#666] mb-4">
              Psychological Counselor & Mentor
            </p>
            
            <div className="w-10 h-[3px] bg-[#7ecab0] mb-6" />

            <p className="font-sans text-[15px] text-[#444] leading-relaxed mb-8 max-w-[540px]">
              "I founded Hope Counseling with a single belief — that every person 
              deserves a safe space to be heard without judgment. With expertise 
              spanning stress management, relationships, and youth development, 
              I combine evidence-based techniques with genuine human compassion 
              to walk alongside you on your journey."
            </p>

            <blockquote className="border-l-[3px] border-[#7ecab0] pl-6 mb-10 py-1">
              <p className="font-playfair italic text-lg text-[#0d2b22] mb-2">
                "My goal isn't to fix you — it's to remind you that you were never broken."
              </p>
              <cite className="font-sans text-[11px] text-[#666] uppercase tracking-widest not-italic">
                — Maryann Wangari
              </cite>
            </blockquote>

            <div className="flex flex-wrap gap-4 mb-10">
              {stats.map((stat) => (
                <div 
                  key={stat}
                  className="px-4 py-2 bg-white border border-black/[0.03] rounded-xl shadow-sm text-[11px] font-sans text-[#0d2b22] font-semibold tracking-wide"
                >
                  {stat}
                </div>
              ))}
            </div>

            <a 
              href="#book"
              className="inline-flex items-center px-8 h-12 bg-[#0d2b22] text-[#7ecab0] rounded-full font-sans text-[11px] font-medium uppercase tracking-[0.15em] transition-all hover:bg-[#1a4a38] group"
            >
              Book with Maryann
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
