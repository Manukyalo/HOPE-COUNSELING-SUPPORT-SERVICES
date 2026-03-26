"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do I know if counseling is right for me?",
    answer: "If you're feeling overwhelmed, stuck, or simply want to understand yourself better, counseling can provide a safe space. Our initial 'Discovery' session is designed specifically to help you determine if our approach therapy aligns with your needs."
  },
  {
    question: "Are the sessions confidential?",
    answer: "Absolutely. Confidentiality is the cornerstone of psychological practice. Your information and everything discussed in sessions are protected by strict ethical guidelines and clinical standards."
  },
  {
    question: "How long is a typical session?",
    answer: "Standard sessions are 45-50 minutes long. This allows enough time for deep processing while ensuring you can integrate the insights into your daily life without feeling drained."
  }
];

const testimonials = [
  {
    quote: "Hope Counseling changed how I navigate stress. The techniques are practical and the support is genuinely empathetic.",
    author: "Quinter",
    role: "Individual Client"
  },
  {
    quote: "Our relationship sessions gave us the tools to communicate again. It's like we finally speak the same language.",
    author: "Asnath",
    role: "Relationship Counseling"
  }
];

export default function ExtraFeatures() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          
          {/* Testimonials Carousel */}
          <div className="bg-[#0d2b22] rounded-[30px] p-8 md:p-14 relative overflow-hidden flex flex-col justify-center min-h-[450px]">
            {/* Decorative Quote Mark */}
            <div className="absolute top-[-10px] left-6 font-playfair text-[120px] text-white/[0.04] leading-none pointer-events-none select-none">
              "
            </div>

            <div className="relative z-10">
              <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] mb-8 block font-medium">
                Testimonials
              </span>

              <div className="relative min-h-[160px] md:min-h-[140px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <p className="font-playfair italic text-xl md:text-2xl text-[#f5f2ec] leading-relaxed max-w-[520px]">
                      "{testimonials[currentTestimonial].quote}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1a4a38] rounded-full flex items-center justify-center font-sans text-[13px] text-[#a8e6cf] font-medium border border-[#7ecab0]/20">
                    {testimonials[currentTestimonial].author[0]}
                  </div>
                  <div>
                    <h4 className="font-sans text-[13px] text-[#a8e6cf] font-medium">
                      {testimonials[currentTestimonial].author}
                    </h4>
                    <p className="font-sans text-[10px] text-[#f5f2ec]/40 uppercase tracking-wider">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        currentTestimonial === i ? "bg-[#7ecab0] w-4" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="flex flex-col justify-center">
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] mb-3 block font-medium">
              Common Questions
            </span>
            <h2 className="font-playfair text-3xl md:text-[36px] text-[#0d2b22] leading-tight mb-10">
              A Clearer <span className="italic">Path</span> Ahead
            </h2>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-black/[0.05] last:border-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left py-6 flex items-center justify-between group"
                  >
                    <span className="font-playfair text-lg text-[#0d2b22] group-hover:text-[#7ecab0] transition-colors">
                      {faq.question}
                    </span>
                    <span className={`text-xl transition-transform duration-300 ${openFaq === i ? "rotate-45 text-[#7ecab0]" : "text-gray-300"}`}>
                      +
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 font-sans text-sm text-[#666] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
