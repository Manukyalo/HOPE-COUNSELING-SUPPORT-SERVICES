"use client";

import { useState } from "react";
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
        author: "Sarah J.",
        role: "Individual Client"
    },
    {
        quote: "Our relationship sessions gave us the tools to communicate again. It's like we finally speak the same language.",
        author: "David & Maria",
        role: "Relationship Counseling"
    }
];

export default function ExtraFeatures() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Testimonials */}
                    <div>
                        <span className="text-primary-600 font-bold uppercase tracking-[0.4em] text-xs">Social Proof</span>
                        <h2 className="text-4xl font-black text-gray-900 mt-6 mb-12 uppercase tracking-tight">Voices of Healing</h2>

                        <div className="space-y-8">
                            {testimonials.map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 relative"
                                >
                                    <span className="text-6xl text-primary-200 absolute top-4 left-4 font-serif">"</span>
                                    <p className="text-lg text-gray-700 font-bold italic mb-6 relative z-10">
                                        {t.quote}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center font-black text-primary-600 uppercase text-xs">
                                            {t.author[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">{t.author}</h4>
                                            <p className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em]">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div>
                        <span className="text-primary-600 font-bold uppercase tracking-[0.4em] text-xs">Clearer Path</span>
                        <h2 className="text-4xl font-black text-gray-900 mt-6 mb-12 uppercase tracking-tight">Common Questions</h2>

                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="border-b border-gray-100 last:border-0 pb-4">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full text-left py-6 flex items-center justify-between group"
                                    >
                                        <span className="text-xl font-black text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                            {faq.question}
                                        </span>
                                        <span className={`text-2xl transition-transform duration-300 ${openFaq === i ? "rotate-45 text-primary-600" : "text-gray-300"}`}>
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
                                                <p className="pb-6 text-gray-500 font-medium leading-relaxed">
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
