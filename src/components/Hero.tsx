"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0d2b22]">
      {/* Decorative Background Text */}
      <div className="absolute top-20 right-10 z-0 pointer-events-none select-none">
        <span className="font-playfair text-[160px] text-white/[0.03] leading-none">
          Hope
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
        {/* Left Side: Content (60%) */}
        <div className="w-full md:w-[60%] pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] mb-4 block font-medium">
              Thika, Kenya · Since 2024
            </span>
            <h1 className="font-playfair text-4xl md:text-[52px] text-[#f5f2ec] leading-[1.15] mb-6">
              Your Mind Deserves <br />
              <span className="italic">Gentle Care</span>
            </h1>
            <p className="font-sans text-sm md:text-[14px] text-[#f5f2ec]/60 max-w-[340px] mb-10 leading-relaxed">
              Expert psychological support for your journey to mental wellness and inner peace. We believe in providing a safe space for growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#book"
                className="px-8 py-3 bg-[#7ecab0] hover:bg-[#a8e6cf] text-[#0d2b22] rounded-full font-sans font-medium text-[13px] transition-all"
              >
                Book Your Session
              </a>
              <a
                href="#services"
                className="px-8 py-3 border border-white/30 text-white hover:bg-white/5 rounded-full font-sans font-medium text-[13px] transition-all"
              >
                Our Services
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Visual (40%) */}
        <div className="w-full md:w-[40%] h-[400px] md:h-[600px] relative mt-12 md:mt-0 hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.65, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/ma.jpeg"
              alt="Hope Counseling Session"
              fill
              className="object-cover saturate-[0.7] rounded-l-[40px] md:rounded-l-none"
              priority
            />
            {/* Gradient Overlay fading left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d2b22] via-[#0d2b22]/20 to-transparent" />
          </motion.div>

          {/* Floating Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-10 right-0 md:right-[-20px] bg-white/[0.08] backdrop-blur-[8px] border border-white/[0.12] rounded-[14px] p-6 pr-12 shadow-2xl z-20"
          >
            <div className="font-playfair text-[28px] text-[#a8e6cf] leading-none mb-1">
              10+
            </div>
            <div className="font-sans text-[10px] uppercase tracking-wider text-[#f5f2ec]/60">
              Expertise Fields
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile background adjustment if needed (simplified) */}
      <div className="absolute inset-0 md:hidden z-0 bg-gradient-to-b from-[#0d2b22] via-[#0d2b22]/80 to-[#1a4a38]" />
    </section>
  );
}
