"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ClientExperiences() {
  return (
    <section id="feedback" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#7ecab0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#0d2b22]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4ece1] text-[#6d4c2a] font-sans text-[11px] font-semibold tracking-wider uppercase mb-4">
            <span>💌</span>
            <span>Client Experiences</span>
          </div>
          <h2 className="font-instrument text-4xl sm:text-5xl md:text-[56px] text-[#0d2b22] leading-[1.1] mb-5">
            Reflections from the <br />
            <span className="italic text-[#2d6e5a]">Healing Journey</span>
          </h2>
          <p className="font-sans text-sm md:text-base text-[#666] leading-relaxed max-w-2xl mx-auto">
            A glimpse into what clients have shared about their experience of receiving support.
          </p>
        </div>

        {/* Narrative Feedback */}
        <div className="max-w-3xl mx-auto mb-12">
          {/* Students & Young Adults */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#f9f7f4] rounded-3xl p-8 sm:p-10 border border-black/[0.04] shadow-sm hover:shadow-xl hover:shadow-[#0d2b22]/5 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-3 rounded-2xl bg-white shadow-xs">🌸</span>
                  <div>
                    <h3 className="font-instrument text-2xl text-[#0d2b22]">
                      Students & Young Adults
                    </h3>
                    <span className="font-sans text-[11px] uppercase tracking-wider text-[#7ecab0] font-semibold">
                      Academic & Personal Growth
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm md:text-base text-[#444] font-sans leading-relaxed">
                <p className="bg-white/70 p-5 rounded-2xl border border-black/[0.02]">
                  "Clients shared that they felt heard, supported and understood throughout the sessions. Some expressed appreciation for having a safe, non-judgmental space to talk openly, reflect on their experiences and work through their concerns."
                </p>
                <p className="bg-white/70 p-5 rounded-2xl border border-black/[0.02]">
                  "Several clients also described noticing personal progress, including improved emotional awareness, coping and confidence in handling challenges."
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-black/[0.05] flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white text-[#2d6e5a] text-[11px] font-sans font-medium">
                Safe & Non-Judgmental
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-[#2d6e5a] text-[11px] font-sans font-medium">
                Emotional Awareness
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-[#2d6e5a] text-[11px] font-sans font-medium">
                Coping & Confidence
              </span>
            </div>
          </motion.div>
        </div>

        {/* Card 3: What I Value Most (Counselor's Commitment) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-[#0d2b22] text-[#f5f2ec] p-8 sm:p-12 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden mb-12"
        >
          {/* Subtle watermarked quote symbol */}
          <div className="absolute top-2 right-8 font-instrument italic text-[160px] text-white/[0.03] leading-none pointer-events-none select-none">
            “
          </div>

          <div className="max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#a8e6cf] font-sans text-[11px] font-semibold tracking-wider uppercase mb-6">
              <span>🤍</span>
              <span>What I Value Most</span>
            </div>

            <blockquote className="border-l-2 border-[#7ecab0] pl-6 md:pl-8 py-2 mb-8">
              <p className="font-instrument italic text-2xl sm:text-3xl md:text-4xl text-[#f5f2ec] leading-relaxed">
                "Every person's journey is different. My role is to provide a safe, empathetic and confidential space where you can explore what you're experiencing, build self-awareness and work towards meaningful change."
              </p>
            </blockquote>

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-[#7ecab0]">
                <Image
                  src="/footer.jpeg"
                  alt="Maryann Wangari"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-instrument text-xl text-white">Maryann Wangari</h4>
                <p className="font-sans text-xs text-[#a8e6cf] tracking-wide">
                  Lead Psychological Counselor & Mentor
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Anonymity & Ethics Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#f9f7f4] rounded-2xl p-5 sm:p-6 border border-black/[0.04] flex items-center gap-4 text-xs font-sans text-[#666]"
        >
          <div className="w-9 h-9 rounded-full bg-[#0d2b22] text-[#a8e6cf] flex items-center justify-center shrink-0 text-sm">
            🛡️
          </div>
          <p className="leading-relaxed">
            <strong className="text-[#0d2b22] font-semibold">Confidentiality Guarantee: </strong>
            Client experiences are shared as anonymized summaries. No identifying information is included and feedback is only used with appropriate permission.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
