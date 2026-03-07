"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const moods = [
    { emoji: "😊", label: "Great", color: "bg-green-100 text-green-700" },
    { emoji: "🙂", label: "Good", color: "bg-blue-100 text-blue-700" },
    { emoji: "😐", label: "Okay", color: "bg-yellow-100 text-yellow-700" },
    { emoji: "😔", label: "Down", color: "bg-orange-100 text-orange-700" },
    { emoji: "😢", label: "Hard", color: "bg-red-100 text-red-700" },
];

export default function MoodTracker() {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [history, setHistory] = useState([
        { date: "Yesterday", mood: "🙂" },
        { date: "2 days ago", mood: "😐" },
    ]);

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
        setHistory([{ date: "Today", mood }, ...history]);
    };

    return (
        <section id="mood-tracker" className="py-20 bg-sage-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                >

                    {/* Client Side */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white p-8 rounded-3xl shadow-xl border border-sage-200"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">How are you feeling today?</h2>
                        <p className="text-gray-500 mb-8">Your counselor uses this to better prepare for your sessions.</p>

                        <div className="flex justify-between gap-4">
                            {moods.map((m) => (
                                <button
                                    key={m.label}
                                    onClick={() => handleMoodSelect(m.emoji)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${selectedMood === m.emoji ? m.color + " ring-4 ring-offset-2 scale-110" : "bg-gray-50 hover:bg-gray-100 text-gray-400"
                                        }`}
                                >
                                    <span className="text-4xl">{m.emoji}</span>
                                    <span className="text-xs font-bold uppercase tracking-tighter">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Counselor Side (Demo View) */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass p-8 rounded-3xl border border-white/40 bg-white/40"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">💼</div>
                            <h3 className="text-xl font-bold text-gray-800">Counselor Dashboard View</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-500 uppercase">Recent Client Mood Activity</p>
                            {history.map((h, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white/80">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{h.mood}</span>
                                        <span className="font-medium text-gray-700">{h.date}</span>
                                    </div>
                                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full font-bold">LOGGED</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-primary-600 rounded-xl text-white text-sm">
                            <p className="font-bold mb-1">Counselor Tip:</p>
                            <p className="opacity-90">Client seems to be improving. Focus on positive reinforcement during next session.</p>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
}
