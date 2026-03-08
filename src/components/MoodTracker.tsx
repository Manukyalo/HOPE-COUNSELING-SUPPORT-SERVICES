"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResourceSanctuary() {
    const [breathState, setBreathState] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (breathState !== "idle") {
            interval = setInterval(() => {
                setTimer((prev) => (prev + 1) % 12);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [breathState]);

    useEffect(() => {
        if (breathState !== "idle") {
            if (timer < 4) setBreathState("inhale");
            else if (timer < 8) setBreathState("hold");
            else setBreathState("exhale");
        }
    }, [timer]);

    const resources = [
        {
            title: "Mindful Breathing",
            type: "Exercise",
            desc: "A rhythmic session to center your thoughts and reduce immediate stress.",
            link: "#"
        },
        {
            title: "Understanding Anxiety",
            type: "Article",
            desc: "Deep dive into the physiological roots of anxiety and how to manage them daily.",
            link: "#"
        },
        {
            title: "Sleep Hygiene",
            type: "Guide",
            desc: "Practical steps to transform your evening routine for restorative rest.",
            link: "#"
        }
    ];

    const quotes = [
        "Healing is not linear, it's a series of small, brave choices.",
        "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.",
        "Peace is not the absence of conflict, but the ability to cope with it."
    ];

    return (
        <section id="resources" className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header - Centralized */}
                <div className="text-center mb-20">
                    <span className="text-primary-600 font-bold uppercase tracking-[0.4em] text-xs">Mindfulness Hub</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-6 uppercase tracking-tight">Resource Sanctuary</h2>
                    <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
                    <p className="text-gray-500 mt-8 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        Explore our curated library of mental health tools designed to support your journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-24">
                    {/* Daily Quote Card */}
                    <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl relative border border-gray-100 flex flex-col justify-center">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                        <p className="text-2xl md:text-3xl text-gray-800 italic leading-relaxed mb-8 font-medium">
                            "{quotes[1]}"
                        </p>
                        <cite className="text-primary-600 font-black uppercase tracking-[0.3em] text-sm">— Daily Wisdom</cite>
                    </div>

                    {/* Interactive Breathwork Card */}
                    <div className="bg-primary-900 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]"></div>

                        <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-10 text-primary-300">Guided Relaxation</h3>

                        <div className="relative w-48 h-48 flex items-center justify-center mb-10">
                            <motion.div
                                animate={{
                                    scale: breathState === "inhale" ? 1.5 : breathState === "exhale" ? 1 : 1.5,
                                    opacity: breathState === "idle" ? 0.2 : 1
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-40"
                            />
                            <motion.div
                                animate={{
                                    scale: breathState === "inhale" ? 1.2 : breathState === "exhale" ? 0.8 : 1.2
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="w-32 h-32 border-4 border-white rounded-full flex items-center justify-center relative z-10"
                            >
                                <span className="text-xs font-black uppercase tracking-widest">
                                    {breathState === "idle" ? "Start" : breathState}
                                </span>
                            </motion.div>
                        </div>

                        {breathState === "idle" ? (
                            <button
                                onClick={() => setBreathState("inhale")}
                                className="px-8 py-3 bg-white text-primary-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                            >
                                Begin Session
                            </button>
                        ) : (
                            <button
                                onClick={() => { setBreathState("idle"); setTimer(0); }}
                                className="text-primary-300 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                            >
                                End Exercise
                            </button>
                        )}
                    </div>
                </div>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {resources.map((res, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border border-gray-50 group"
                        >
                            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] uppercase font-black tracking-widest mb-6">
                                {res.type}
                            </span>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{res.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">{res.desc}</p>

                            <a href={res.link} className="flex items-center gap-3 text-gray-900 font-bold uppercase tracking-widest text-[10px] hover:gap-5 transition-all">
                                Enter Resource <span className="text-lg">→</span>
                            </a>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-gray-400 font-medium mb-8">Ready to take the first step towards personalized growth?</p>
                    <a
                        href="#book"
                        className="inline-flex items-center px-10 py-5 bg-primary-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary-600/30 hover:scale-105 hover:bg-primary-700 transition-all"
                    >
                        Start Journey Today
                    </a>
                </div>
            </div>
        </section>
    );
}
