"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-[#f9f7f4]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] mb-3 block font-medium">
              About Our Practice
            </span>
            <h2 className="font-playfair text-3xl md:text-[42px] text-[#0d2b22] leading-tight mb-8">
              Guided by Compassion, <br />
              <span className="italic">Rooted in Excellence.</span>
            </h2>

            <div className="flex gap-6 mb-10">
              <div className="w-[3px] bg-[#7ecab0] shrink-0" />
              <p className="font-sans text-sm md:text-base text-[#666] leading-relaxed italic">
                "We believe that every individual possesses the innate strength to overcome life's most difficult challenges. Our role is to provide the professional guidance and safe environment necessary to unlock that potential."
              </p>
            </div>

            <p className="font-sans text-sm md:text-base text-[#666] leading-relaxed mb-12">
              Based in Thika, Hope Counseling Support Services provides a sanctuary for mental healing and personal growth. We offer professional psychological support tailored to your unique journey, ensuring you feel seen, heard, and supported every step of the way.
            </p>

            <div className="mb-12">
              <div className="font-playfair text-[48px] text-[#0d2b22] leading-none mb-1">
                10+
              </div>
              <div className="font-sans text-[11px] uppercase tracking-widest text-[#666]">
                Expertise Fields in Psychology
              </div>
            </div>

            <Link
              href="/approach"
              className="px-8 py-3.5 border border-[#0d2b22] text-[#0d2b22] hover:bg-[#0d2b22] hover:text-white rounded-full font-sans font-medium text-[13px] transition-all"
            >
              Our Team Approach
            </Link>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[20px] overflow-hidden shadow-2xl relative z-10">
              <Image
                src="/ma.jpeg"
                alt="Hope Counseling Support Services"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Subtle decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#7ecab0]/10 rounded-full blur-3xl z-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
