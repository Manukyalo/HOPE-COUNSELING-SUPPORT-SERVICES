"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Service } from "@/app/services/[slug]/page";

export default function ServiceDetailContent({ service }: { service: Service }) {
  const whatsappLink = `https://wa.me/254701279231?text=Hi%20Hope%20Counseling%2C%20I'm%20interested%20in%20learning%20more%20about%20your%20${encodeURIComponent(service.eyebrow)}%20services.`;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#f9f7f4]"
    >
      {/* 1. HERO AREA */}
      <section className="relative h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          {/* Dark gradient from bottom, 60% opacity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-4 block font-medium">
              {service.eyebrow}
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-white mb-6 leading-tight">
              {service.title}
            </h1>
            <p className="font-sans text-sm md:text-lg text-white/80 max-w-xl font-light leading-relaxed">
              {service.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. SECTION 1: What this is */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <div className="space-y-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] block font-medium">Overview</span>
              <p className="font-sans text-base text-[#666] leading-relaxed">
                {service.longContent}
              </p>
            </div>

            <div className="pl-8 border-l-2 border-[#7ecab0]/30 space-y-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#0d2b22]/40 block font-medium">What sessions cover</span>
              <ul className="space-y-4">
                {service.whatIsCovered.map((item, i) => (
                  <li key={i} className="font-sans text-[14px] text-[#0d2b22] leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: Who this is for */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] block font-medium mb-3">Targeted Focus</span>
            <h2 className="font-playfair text-2xl md:text-3xl text-[#0d2b22]">Who this is for</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.whoIsItFor.map((target, i) => (
              <div key={i} className="bg-[#f5f2ec]/60 p-10 rounded-[20px] text-center flex items-center justify-center min-h-[140px]">
                <p className="font-playfair italic text-lg text-[#0d2b22]/80 leading-tight">
                  "{target}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: What a session looks like */}
      <section className="py-20 md:py-40">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] block font-medium mb-3">The Process</span>
            <h2 className="font-playfair text-2xl md:text-3xl text-[#0d2b22]">What a session looks like</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            {/* Connector Line (Desktop Only) */}
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-[#0d2b22]/5 z-0" />
            
            {service.sessionSteps.map((step, i) => (
              <div key={i} className="relative z-10 text-center space-y-6 group">
                <div className="w-14 h-14 bg-white border border-[#7ecab0]/30 rounded-full flex items-center justify-center mx-auto text-[#0d2b22] font-playfair text-xl shadow-sm transition-transform group-hover:scale-105">
                  {i + 1}
                </div>
                <div className="space-y-2">
                  <h4 className="font-playfair text-[15px] text-[#0d2b22] uppercase tracking-wider">{step.title}</h4>
                  <p className="font-sans text-[13px] text-[#666] leading-relaxed max-w-[200px] mx-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    {step.desc}
                  </p>
                  {/* Fallback for non-hover (always show on mobile or just simplify) */}
                  <p className="md:hidden font-sans text-[13px] text-[#666] leading-relaxed max-w-[200px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION 4: Booking CTA */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-[#0d2b22] rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden">
          {/* Decorative Wordmark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
            <span className="font-playfair text-[120px] md:text-[200px] uppercase tracking-widest whitespace-nowrap">HOPE</span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-8"
          >
            <div className="space-y-4">
              <h2 className="font-playfair text-3xl md:text-5xl text-white leading-tight">
                Ready to take the <br /> <span className="italic text-[#7ecab0]">first step?</span>
              </h2>
              <p className="font-sans text-[14px] text-[#f5f2ec]/60 uppercase tracking-[0.2em] font-light">
                Your first session is free. No forms, no pressure.
              </p>
            </div>
            
            <div className="pt-6">
              <Link
                href={whatsappLink}
                target="_blank"
                className="inline-block px-12 py-5 bg-[#7ecab0] hover:bg-[#a8e6cf] text-[#0d2b22] rounded-full font-sans font-medium uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-black/20"
              >
                Book via WhatsApp
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
