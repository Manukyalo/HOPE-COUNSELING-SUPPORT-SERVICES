"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function MeetCounselor() {
  return (
    <section className="py-24 md:py-32 bg-[#f9f7f4] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-[1000px] mx-auto">
          
          {/* Photo Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[45%] flex flex-col items-center lg:items-start"
          >
            <div className="relative group">
              {/* Solid Depth Element (No Shadow Trick) */}
              <div className="absolute top-[14px] left-[14px] w-full h-full bg-[#a8e6cf] opacity-20 rounded-[18px] z-0" />
              
              <div className="relative z-10 aspect-[3/4] w-[320px] md:w-[380px] lg:w-full rounded-[18px] overflow-hidden grayscale-[0.1] hover:grayscale-0 transition-all duration-700">
                <Image
                  src="/ma.jpeg"
                  alt="Maryann Wangari"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </div>

            {/* Handpicked Pills */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-2">
              {["Certified Counselor", "CBT Practitioner", "Safe Space"].map((pill) => (
                <span 
                  key={pill}
                  className="font-sans text-[10px] font-medium px-3.5 py-1.5 bg-[#e0f4ec] text-[#1e5c45] rounded-[30px] tracking-wide"
                >
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bio Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-[55%]"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#2d6e5a] mb-6 block font-medium">
              Your Counselor
            </span>
            
            <h2 className="font-instrument text-[42px] text-[#0d2b22] leading-[1.1] mb-2 animate-fade-rise">
              Maryann Wangari
            </h2>
            
            <p className="font-inter text-[14px] text-[#888] font-medium tracking-[0.1em] uppercase animate-fade-rise-delay">
              Psychological Counselor & Mentor
            </p>

            {/* Hand-drawn style divider */}
            <div className="w-[36px] h-[2px] bg-[#7ecab0] rounded-[2px] my-[18px]" />

            <div className="space-y-8">
              <p className="font-sans text-[16px] text-[#444] leading-[1.7] max-w-[500px]">
                "I started Hope Counseling because I saw how many people were 
                carrying weight they didn't have to carry alone. Whether you're 
                dealing with anxiety, a difficult relationship, or just feeling 
                stuck; this is a place where you can speak freely and be met 
                with honesty, not judgment."
              </p>

              <blockquote className="border-l-[3px] border-[#7ecab0] pl-[24px] py-2 animate-fade-rise-delay-2">
                <p className="font-instrument italic text-[20px] text-[#0d2b22] leading-relaxed">
                  "My work isn't about fixing people. It's about sitting with them 
                  until they remember their own strength."
                </p>
              </blockquote>

              <div className="pt-2">
                <p className="font-sans text-[13px] text-[#444] flex items-center gap-3">
                  <span>10+ Specializations</span>
                  <span className="text-[#ccc]">•</span>
                  <span>Free First Session</span>
                </p>
              </div>

              <div className="pt-4">
                <a 
                  href="#book"
                  className="inline-block px-[26px] py-[12px] bg-[#0d2b22] text-white rounded-full font-sans text-[13px] tracking-[0.03em] font-medium transition-opacity hover:opacity-85 active:scale-[0.98]"
                >
                  Book a Session with Maryann
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
