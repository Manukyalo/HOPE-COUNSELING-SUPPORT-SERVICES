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
        <div className="max-w-4xl mx-auto py-12">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="consent"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-primary-50"
                    >
                        <div className="mb-10">
                            <span className="text-primary-500 font-bold uppercase tracking-[0.2em] text-xs">Step 01</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-2">Informed Consent</h2>
                        </div>

                        <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl mb-10 h-72 overflow-y-auto border border-gray-100 leading-relaxed text-gray-600 space-y-4">
                            <p className="font-semibold text-gray-900">Please review and accept our therapeutic agreement:</p>
                            <p>1. <span className="text-gray-900 font-medium">Privacy & Security:</span> All sessions utilize end-to-end encryption. Your information is protected under strict professional confidentiality guidelines.</p>
                            <p>2. <span className="text-gray-900 font-medium">Emergency Protocol:</span> This is not a crisis service. If you are experiencing an immediate mental health emergency, please contact your local emergency services.</p>
                            <p>3. <span className="text-gray-900 font-medium">Attendance Policy:</span> Sessions are booked in 45-minute blocks. Please provide 24-hour notice for cancellations to avoid service fees.</p>
                            <p>4. <span className="text-gray-900 font-medium">Remote Readiness:</span> Ensure you have a quiet, private space and a stable internet connection for the duration of your call.</p>
                        </div>

                        <button
                            onClick={handleConsent}
                            className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary-600/20 uppercase tracking-widest"
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
                        className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-primary-50"
                    >
                        <div className="mb-10">
                            <span className="text-primary-500 font-bold uppercase tracking-[0.2em] text-xs">Step 02</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-2">Schedule Session</h2>
                        </div>

                        <div className="space-y-10">
                            {/* Date Selection */}
                            <div>
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 block">Select Day</label>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {dates.map((d) => (
                                        <button
                                            key={d.date}
                                            onClick={() => setSelectedDate(d.full)}
                                            className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all border ${selectedDate === d.full
                                                    ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105"
                                                    : "bg-white border-gray-100 text-gray-400 hover:border-primary-200 hover:text-primary-500"
                                                }`}
                                        >
                                            <span className="text-xs uppercase font-bold">{d.day}</span>
                                            <span className="text-2xl font-black mt-1">{d.date}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div>
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 block">Available Slots (45 min sessions)</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {times.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTime(t)}
                                            className={`py-4 rounded-xl font-bold transition-all border ${selectedTime === t
                                                    ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/30"
                                                    : "bg-gray-50 border-transparent text-gray-600 hover:bg-white hover:border-primary-200 hover:text-primary-500"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-14 flex flex-col md:flex-row gap-6 items-center">
                            <button
                                onClick={() => setStep(1)}
                                className="text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase tracking-widest text-sm"
                            >
                                Back
                            </button>
                            <button
                                disabled={!selectedDate || !selectedTime}
                                onClick={handleBooking}
                                className="flex-grow w-full py-5 bg-primary-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl uppercase tracking-widest"
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
                        className="bg-white p-10 md:p-20 rounded-[3rem] shadow-2xl border border-green-100 text-center"
                    >
                        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-inner">
                            ✓
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Confirmed</h2>
                        <p className="text-gray-500 mb-12 text-lg">
                            Your session for <span className="text-gray-900 font-bold">{selectedDate}</span> at <span className="text-gray-900 font-bold">{selectedTime}</span> is secured.
                        </p>

                        <div className="bg-primary-50 p-8 rounded-[2rem] border-2 border-dashed border-primary-200 mb-12 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-xs text-primary-600 font-black uppercase tracking-[0.3em] mb-4">Live Session Room</p>
                                <a
                                    href={sessionLink}
                                    target="_blank"
                                    className="text-xl md:text-2xl font-mono text-primary-900 hover:text-primary-600 transition-colors break-all underline"
                                >
                                    {sessionLink}
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setStep(1);
                                setSelectedDate(null);
                                setSelectedTime(null);
                            }}
                            className="px-10 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl font-bold transition-all uppercase tracking-widest text-sm"
                        >
                            Book Another Session
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
