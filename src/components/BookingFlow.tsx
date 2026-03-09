"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BookingFlow() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        needs: ""
    });
    const [refCode, setRefCode] = useState("");

    const handleConsent = () => setStep(2);

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        const currentCount = parseInt(localStorage.getItem("hope_session_count") || "0") + 1;
        localStorage.setItem("hope_session_count", currentCount.toString());
        setRefCode(`C${currentCount.toString().padStart(3, '0')}`);
        setStep(3);
    };

    const dates = [
        { day: "Sun", date: "09", full: "Sunday, March 09" },
        { day: "Mon", date: "10", full: "Monday, March 10" },
        { day: "Tue", date: "11", full: "Tuesday, March 11" },
        { day: "Wed", date: "12", full: "Wednesday, March 12" },
        { day: "Thu", date: "13", full: "Thursday, March 13" },
        { day: "Fri", date: "14", full: "Friday, March 14" },
    ];

    const times = [
        "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
    ];

    const whatsappNumber = "254701279231";
    const generateWhatsAppLink = () => {
        const message = `Hello Hope Counseling,\n\nI would like to book a session.\n\n*Reference:* ${refCode}\n*Date:* ${selectedDate}\n*Time:* ${selectedTime}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Needs:* ${formData.needs}`;
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    };

    return (
        <section id="book" className="py-24 bg-white scroll-mt-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Section Header - Centralized */}
                <div className="text-center mb-16">
                    <span className="text-primary-600 font-bold uppercase tracking-[0.4em] text-xs">Consultation</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-6 uppercase tracking-tight">Get a Professional Quote</h2>
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
                                <h3 className="text-3xl font-black text-gray-900 mt-2 uppercase tracking-tight">Service Agreement</h3>
                            </div>

                            <div className="bg-gray-100/50 p-8 rounded-[2rem] mb-12 h-72 overflow-y-auto border border-gray-100 leading-relaxed text-gray-500 space-y-6 font-medium text-sm">
                                <p className="font-black text-gray-900 uppercase tracking-widest text-xs">Agreement & Privacy:</p>
                                <p>1. <span className="text-gray-900 font-black">Confidentiality:</span> All consultations are handled with the highest level of professional ethical guidelines and privacy.</p>
                                <p>2. <span className="text-gray-900 font-black">Crisis Support:</span> This platform is not for emergencies. If you are in crisis, please contact local emergency responders immediately.</p>
                                <p>3. <span className="text-gray-900 font-black">Session Duration:</span> Standard sessions are 45 minutes of dedicated professional support.</p>
                                <p>4. <span className="text-gray-900 font-black">Direct Communication:</span> Upon confirming your schedule, you will be able to message our counselor directly via WhatsApp to finalize the details.</p>
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
                                <h3 className="text-3xl font-black text-gray-900 mt-2 uppercase tracking-tight">Booking Details</h3>
                            </div>

                            <form onSubmit={handleBooking} className="space-y-12">
                                {/* Date Selection */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 block text-center">Available Dates</label>
                                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide justify-center">
                                        {dates.map((d) => (
                                            <button
                                                type="button"
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
                                                type="button"
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

                                {/* User Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="your@email.com"
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-5 outline-none transition-all font-bold text-gray-900 text-sm"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+254 700 000 000"
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-5 outline-none transition-all font-bold text-gray-900 text-sm"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">How can we help? (Optional)</label>
                                    <textarea
                                        placeholder="Tell us a bit about your needs..."
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl p-5 outline-none transition-all font-bold text-gray-900 text-sm resize-none h-32"
                                        value={formData.needs}
                                        onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                                    />
                                </div>

                                <div className="mt-16 flex flex-col md:flex-row gap-8 items-center pt-8 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-gray-400 font-black hover:text-gray-900 transition-colors uppercase tracking-widest text-xs"
                                    >
                                        Back
                                    </button>
                                    <button
                                        disabled={!selectedDate || !selectedTime || !formData.email || !formData.phone}
                                        type="submit"
                                        className="flex-grow w-full py-6 bg-primary-600 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-950 text-white rounded-[2rem] font-black transition-all shadow-2xl uppercase tracking-[0.3em] text-xs shadow-primary-600/20"
                                    >
                                        Get Your Quote
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 md:p-12 rounded-[4rem] shadow-2xl border border-gray-100 text-center"
                        >
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-inner border border-emerald-100">
                                ✓
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Request Received</h2>
                            <p className="text-gray-500 mb-10 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                                Reference Code: <span className="text-primary-600 font-black">{refCode}</span><br />
                                Your request for <span className="text-primary-600 font-black">{selectedDate}</span> has been logged. Please click below to confirm via WhatsApp.
                            </p>

                            <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-emerald-500/10 mb-12">
                                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.4em] mb-6">Support Available</p>
                                <a
                                    href={generateWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-4 px-10 py-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-[0.2em] text-xs"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.053.888 3.144.889h.002c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zM12.031 16.757c-1.131 0-2.115-.311-2.956-.816l-.212-.128-1.574.412.42-1.533-.141-.223c-.569-.912-.871-1.956-.87-3.029.001-3.08 2.505-5.585 5.586-5.585 3.081 0 5.585 2.505 5.585 5.585.001 3.081-2.505 5.585-5.586 5.585zM14.636 12.188c-.144-.072-.857-.423-.99-.47-.133-.048-.23-.072-.326.072-.097.144-.374.47-.458.566-.084.097-.168.109-.312.037-.144-.072-.607-.224-1.155-.712-.426-.379-.714-.848-.798-.992-.084-.144-.009-.222.063-.293.065-.064.144-.168.216-.252.072-.084.097-.144.144-.241.048-.096.024-.18-.012-.252-.036-.072-.326-.784-.446-1.073-.117-.282-.236-.243-.326-.248-.084-.005-.18-.006-.277-.006s-.253.036-.386.18c-.133.144-.506.494-.506 1.205 0 .711.518 1.398.59 1.494.072.096 1.02 1.557 2.471 2.183.345.149.614.238.823.304.346.11.662.094.912.057.279-.042.857-.35.976-.687.12-.337.12-.627.084-.687-.036-.06-.133-.096-.277-.168z" />
                                    </svg>
                                    Confirm on WhatsApp
                                </a>
                                <p className="mt-8 text-[9px] text-gray-400 uppercase font-black">Professional & Direct Confirmation</p>
                            </div>

                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSelectedDate(null);
                                    setSelectedTime(null);
                                    setFormData({ email: "", phone: "", needs: "" });
                                }}
                                className="px-12 py-5 bg-gray-100 hover:bg-gray-900 text-gray-400 hover:text-white rounded-[2rem] font-black transition-all uppercase tracking-widest text-xs"
                            >
                                Finish
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
