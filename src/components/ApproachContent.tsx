"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ApproachContent() {
  return (
    <main className="min-h-screen bg-[#f9f7f4]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#0d2b22]">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/ma.jpeg"
            alt="Our Approach"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-4 block font-medium">
              Methodology
            </span>
            <h1 className="font-playfair text-4xl md:text-7xl text-white mb-6 leading-tight">
              Our <span className="italic">Perspective</span> on Healing
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] block font-medium">Philosophy</span>
                <h2 className="font-playfair text-3xl md:text-[42px] text-[#0d2b22] leading-tight">Empathy-First Counseling</h2>
                <p className="font-sans text-base text-[#666] leading-relaxed">
                  Our approach begins with a deep, non-judgmental understanding of your unique lived experience. We prioritize building a safe, trusting connection where you feel truly heard, providing the foundation for lasting growth.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white rounded-[24px] border border-black/[0.03] shadow-sm">
                  <h4 className="font-sans text-[10px] uppercase tracking-widest text-[#7ecab0] mb-4 font-medium">Science-Driven</h4>
                  <p className="font-sans text-[13px] text-[#666] leading-relaxed">
                    We utilize evidence-based modalities like CBT and mindfulness to ensure your progress is measurable and sustainable.
                  </p>
                </div>
                <div className="p-8 bg-[#0d2b22] rounded-[24px] text-white">
                  <h4 className="font-sans text-[10px] uppercase tracking-widest text-[#7ecab0] mb-4 font-medium opacity-60">Client-Centered</h4>
                  <p className="font-sans text-[13px] text-[#f5f2ec]/60 leading-relaxed">
                    You are the expert of your life. We act as guides, empowering you to make decisions that align with your core values.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[30px] overflow-hidden shadow-2xl relative z-10 grayscale-[0.2]">
                <Image
                  src="/ma.jpeg"
                  alt="Collaboration"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#7ecab0]/10 rounded-full blur-3xl opacity-60 z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-20 md:py-32 bg-[#0d2b22] relative overflow-hidden">
        {/* Grain Overlay */}
        <div className="grain-overlay opacity-50" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] mb-4 block font-medium">The Journey</span>
            <h2 className="font-playfair text-3xl md:text-[42px] text-white leading-tight">
              A Structured Path to <span className="italic">Self-Discovery</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "A free initial consultation to understand your needs and see if our expertise aligns with your goals." },
              { step: "02", title: "Strategic Plan", desc: "Collaboratively developing a roadmap tailored to your specific mental wellness objectives." },
              { step: "03", title: "Continuous Growth", desc: "Regular weekly or bi-weekly sessions focused on skill-building, processing, and sustained growth." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-10 bg-white/[0.03] rounded-[24px] border border-white/[0.05] backdrop-blur-sm group hover:bg-white/[0.05] transition-all"
              >
                <span className="font-playfair text-5xl text-[#7ecab0]/10 mb-6 block group-hover:text-[#7ecab0]/20 transition-colors">{item.step}</span>
                <h3 className="font-playfair text-xl text-white mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="font-sans text-xs text-[#f5f2ec]/40 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="font-playfair text-3xl md:text-[42px] text-[#0d2b22] leading-tight mb-12">
            Ready to start your <br />
            <span className="italic">Personal</span> Growth?
          </h2>
          <Link
            href="/#book"
            className="inline-block px-12 py-5 bg-[#0d2b22] text-[#7ecab0] rounded-[30px] font-sans font-medium uppercase tracking-widest text-xs hover:bg-[#1a4a38] transition-all shadow-xl shadow-black/5"
          >
            Book Your Session
          </Link>
        </div>
      </section>
    </main>
  );
}
