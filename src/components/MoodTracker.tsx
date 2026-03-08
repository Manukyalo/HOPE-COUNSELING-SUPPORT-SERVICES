"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GrowthJourney() {
    const [activeTab, setActiveTab] = useState<"pulse" | "journey">("pulse");

    const dailyQuotes = [
        { text: "Healing is not linear, it's a series of small, brave choices.", author: "Hope Team" },
        { text: "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.", author: "Amaya" },
        { text: "Peace is not the absence of conflict, but the ability to cope with it.", author: "Counseling Wisdom" }
    ];

    const journeyMilestones = [
        { title: "First Step", date: "Initial Session", status: "completed", desc: "Acknowledging the need for support." },
        { title: "Building Tools", date: "Module 1", status: "active", desc: "Learning core coping mechanisms." },
        { title: "Deep Growth", date: "Module 2", status: "locked", desc: "Exploring underlying patterns." }
    ];

    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-16">
                    <div className="bg-white p-2 rounded-2xl shadow-xl flex gap-2 border border-gray-100">
                        <button
                            onClick={() => setActiveTab("pulse")}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === "pulse" ? "bg-primary-900 text-white" : "text-gray-400 hover:text-gray-900"}`}
                        >
                            Daily Pulse
                        </button>
                        <button
                            onClick={() => setActiveTab("journey")}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === "journey" ? "bg-primary-900 text-white" : "text-gray-400 hover:text-gray-900"}`}
                        >
                            My Journey
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "pulse" ? (
                        <motion.div
                            key="pulse"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <span className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl shadow-inner">✧</span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">Today's Mindfulness Pulse</h2>
                            <blockquote className="bg-white p-12 rounded-[3rem] shadow-2xl relative border border-gray-100 overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-primary-500"></div>
                                <p className="text-2xl md:text-3xl text-gray-700 italic leading-relaxed mb-6 font-medium">
                                    "{dailyQuotes[1].text}"
                                </p>
                                <cite className="text-primary-600 font-bold uppercase tracking-[0.2em] text-sm group-hover:tracking-[0.4em] transition-all">— {dailyQuotes[1].author}</cite>
                            </blockquote>
                            <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center">
                                <p className="text-gray-500 font-medium">Ready to start your own growth story?</p>
                                <button className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-600/20 hover:scale-105 transition-transform uppercase tracking-widest text-sm">
                                    Start Journey Today
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="journey"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {journeyMilestones.map((milestone, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`p-8 rounded-[2.5rem] bg-white border shadow-xl relative overflow-hidden ${milestone.status === 'locked' ? 'opacity-50 grayscale' : 'border-primary-100'}`}
                                    >
                                        {milestone.status === 'completed' && (
                                            <div className="absolute top-4 right-4 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">✓</div>
                                        )}
                                        <span className="text-xs font-black text-primary-500 uppercase tracking-widest mb-4 block">{milestone.date}</span>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4">{milestone.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6">{milestone.desc}</p>

                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full bg-primary-500 ${milestone.status === 'completed' ? 'w-full' : milestone.status === 'active' ? 'w-1/3' : 'w-0'}`}></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-16 bg-primary-900 p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]"></div>
                                <div>
                                    <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Your Progress is Private</h3>
                                    <p className="text-primary-300 font-medium">Only you and your assigned counselor can view your journey milestones.</p>
                                </div>
                                <button className="whitespace-nowrap px-10 py-5 bg-white text-primary-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-500 hover:text-white transition-all">
                                    Access Full Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
