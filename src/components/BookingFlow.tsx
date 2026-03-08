"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingFlow() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [sessionLink, setSessionLink] = useState("");

    const handleConsent = () => setStep(2);

    const handleBooking = () => {
        const roomId = Math.random().toString(36).substring(7);
        setSessionLink(`https://meet.jit.si/HopeCounseling_${roomId}`);
        setStep(3);
    };

    const dates = [
        { day: "Mon", date: "10", full: "Monday, March 10" },
        { day: "Tue", date: "11", full: "Tuesday, March 11" },
        { day: "Wed", date: "12", full: "Wednesday, March 12" },
        { day: "Thu", date: "13", full: "Thursday, March 13" },
        { day: "Fri", date: "14", full: "Friday, March 14" },
    ];

    const times = [
        "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
    ];

    return (
        <section id="book" className="py-24 bg-white scroll-mt-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Section Header - Centralized */}
                <div className="text-center mb-16">
                    <span className="text-primary-600 font-bold uppercase tracking-[0.4em] text-xs">Reservations</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-6 uppercase tracking-tight">Secure Your Session</h2>
                    <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="consent"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-gray-100"
                        >
                            <div className="text-center mb-10">
                                <span className="text-primary-500 font-black uppercase tracking-[0.3em] text-[10px]">Phase 01</span>
                                <h3 className="text-3xl font-black text-gray-900 mt-2 uppercase tracking-tight">Informed Consent</h3>
                            </div>

                            <div className="bg-gray-100/50 p-8 rounded-[2rem] mb-12 h-72 overflow-y-auto border border-gray-100 leading-relaxed text-gray-500 space-y-6 font-medium text-sm">
                                <p className="font-black text-gray-900 uppercase tracking-widest text-xs">Agreement & Privacy:</p>
                                <p>1. <span className="text-gray-900 font-black">Confidentiality:</span> All sessions utilize secure end-to-end encryption. Your data is protected by strict ethical guidelines.</p>
                                <p>2. <span className="text-gray-900 font-black">Crisis Support:</span> This platform is not for emergencies. If you are in crisis, please contact local emergency responders immediately.</p>
                                <p>3. <span className="text-gray-900 font-black">Attendance:</span> Sessions are 45 minutes. A 24-hour cancellation notice is required to honor our mutual commitment.</p>
                                <p>4. <span className="text-gray-900 font-black">Environment:</span> Please ensure a private, quiet space with stable connectivity for optimal therapeutic impact.</p>
                            </div>

                            <button
                                onClick={handleConsent}
                                className="w-full py-6 bg-primary-600 hover:bg-primary-900 text-white rounded-[2rem] font-black transition-all shadow-xl shadow-primary-600/30 uppercase tracking-[0.3em] text-xs"
                            >
                                I Understand and Accept
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-gray-100"
                        >
                            <div className="text-center mb-12">
                                <span className="text-primary-500 font-black uppercase tracking-[0.3em] text-[10px]">Phase 02</span>
                                <h3 className="text-3xl font-black text-gray-900 mt-2 uppercase tracking-tight">Select Schedule</h3>
                            </div>

                            <div className="space-y-12">
                                {/* Date Selection */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 block text-center">Available Dates</label>
                                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide justify-center">
                                        {dates.map((d) => (
                                            <button
                                                key={d.date}
                                                onClick={() => setSelectedDate(d.full)}
                                                className={`flex-shrink-0 w-24 h-28 rounded-3xl flex flex-col items-center justify-center transition-all border-2 ${selectedDate === d.full
                                                    ? "bg-primary-900 border-primary-900 text-white shadow-2xl shadow-primary-900/30 scale-110"
                                                    : "bg-white border-gray-100 text-gray-400 hover:border-primary-200 hover:text-primary-500"
                                                    }`}
                                            >
                                                <span className="text-[10px] uppercase font-black tracking-widest">{d.day}</span>
                                                <span className="text-3xl font-black mt-2">{d.date}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 block text-center">Standard Sessions (45 min)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {times.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setSelectedTime(t)}
                                                className={`py-5 rounded-2xl font-black transition-all border-2 text-xs tracking-widest ${selectedTime === t
                                                    ? "bg-primary-900 border-primary-900 text-white shadow-xl shadow-primary-900/10"
                                                    : "bg-gray-100 border-transparent text-gray-500 hover:bg-white hover:border-primary-200 hover:text-primary-900"
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 flex flex-col md:flex-row gap-8 items-center">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-gray-400 font-black hover:text-gray-900 transition-colors uppercase tracking-widest text-xs"
                                >
                                    Back
                                </button>
                                <button
                                    disabled={!selectedDate || !selectedTime}
                                    onClick={handleBooking}
                                    className="flex-grow w-full py-6 bg-primary-600 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-950 text-white rounded-[2rem] font-black transition-all shadow-2xl uppercase tracking-[0.3em] text-xs shadow-primary-600/20"
                                >
                                    Confirm Appointment
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-gray-100 text-center"
                        >
                            <div className="w-28 h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-12 text-5xl shadow-inner animate-bounce">
                                ✓
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">Appointment Secured</h2>
                            <p className="text-gray-500 mb-12 text-lg font-medium leading-relaxed">
                                Your session for <span className="text-primary-600 font-black">{selectedDate}</span> at <span className="text-primary-600 font-black">{selectedTime}</span> has been confirmed in our system.
                            </p>

                            <div className="bg-primary-900 p-10 rounded-[3rem] border-4 border-dashed border-primary-500/30 mb-12 relative overflow-hidden group shadow-2xl">
                                <div className="relative z-10">
                                    <p className="text-[10px] text-primary-300 font-black uppercase tracking-[0.4em] mb-6">Encrypted Session Room</p>
                                    <a
                                        href={sessionLink}
                                        target="_blank"
                                        className="text-lg md:text-xl font-mono text-white hover:text-primary-400 transition-colors break-all underline decoration-primary-500/50 underline-offset-8"
                                    >
                                        {sessionLink}
                                    </a>
                                    <p className="mt-8 text-primary-400 text-[10px] font-black uppercase tracking-widest">Keep this link private</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSelectedDate(null);
                                    setSelectedTime(null);
                                }}
                                className="px-12 py-5 bg-gray-100 hover:bg-gray-950 text-gray-400 hover:text-white rounded-[2rem] font-black transition-all uppercase tracking-widest text-xs"
                            >
                                Schedule Another
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
