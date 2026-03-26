"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Service {
  title: string;
  image: string;
  description: string;
  longContent: string[];
  benefits: string[];
}

export default function ServiceDetailContent({ service }: { service: Service }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#f9f7f4]"
    >
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#0d2b22]/70 backdrop-blur-[2px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-4 block font-medium">
              Specialized Service
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-white mb-6 leading-tight">
              {service.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
            <div className="lg:col-span-2 space-y-8">
              {service.longContent.map((paragraph, i) => (
                <p key={i} className="font-sans text-sm md:text-base text-[#666] leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="pt-12">
                <Link
                  href="/#book"
                  className="inline-block px-10 py-4 bg-[#0d2b22] text-[#7ecab0] rounded-[30px] font-sans font-medium uppercase tracking-widest text-[10px] hover:bg-[#1a4a38] transition-all"
                >
                  Book This Session
                </Link>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[24px] border border-black/[0.03] shadow-sm">
                <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-8 font-medium">Key Benefits</h4>
                <ul className="space-y-6">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-4 font-sans text-[13px] text-[#0d2b22] leading-tight group">
                      <span className="w-1.5 h-1.5 bg-[#7ecab0] rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0d2b22] p-10 rounded-[24px] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-4 font-medium opacity-60">Session Information</h4>
                  <p className="font-playfair text-2xl text-[#f5f2ec]">45 Minutes</p>
                  <p className="font-sans text-[10px] text-[#f5f2ec]/40 mt-4 uppercase tracking-widest">Standard clinical duration</p>
                </div>
                <div className="absolute -bottom-6 -right-6 font-playfair text-8xl text-white/[0.03] pointer-events-none italic">
                  H
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
