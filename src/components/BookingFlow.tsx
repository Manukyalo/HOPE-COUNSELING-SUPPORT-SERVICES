"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { id: "stress", name: "Stress & Anxiety", sub: "For when the pressure feels unmanageable" },
  { id: "relationship", name: "Relationship Counseling", sub: "For couples or individuals navigating conflict" },
  { id: "youth", name: "Youth Mentorship", sub: "For teenagers and young adults finding their footing" },
  { id: "academic", name: "Academic Guidance", sub: "For students feeling overwhelmed or directionless" },
  { id: "emotional", name: "Emotional Support", sub: "For those who just need to be heard" },
];

const timeRefs = ["Morning", "Afternoon", "Evening"];

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agreed: false,
  });

  const days = useMemo(() => {
    const d = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      d.push({
        label: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        short: date.toLocaleDateString("en-US", { weekday: "short" }),
        num: date.getDate(),
        isToday: i === 0,
        isPast: false, // Simple logic for current week strip
      });
    }
    return d;
  }, []);

  const handleWhatsApp = () => {
    const sName = services.find(s => s.id === selectedService)?.name;
    const text = `Hello, I'd like to book a ${sName} session on ${selectedDate} (${selectedTime}). My name is ${formData.name}.`;
    window.open(`https://wa.me/254701279231?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="book" className="py-24 md:py-40 bg-[#f9f7f4]">
      <div className="container mx-auto px-6 max-w-[580px]">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="font-playfair text-3xl text-[#0d2b22] mb-4">
            Schedule a Free Consultation
          </h2>
          <p className="font-sans text-[13px] text-[#666] tracking-wide">
            Your first session costs nothing. No pressure, no commitment.
          </p>
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="flex justify-center items-center gap-3 mb-16 relative">
          <div className="absolute h-[1px] bg-black/[0.06] w-24 z-0" />
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-sans transition-all duration-500 z-10 relative ${
                step === i 
                  ? "border border-[#7ecab0] text-[#7ecab0] bg-[#f9f7f4]" 
                  : step > i 
                  ? "bg-[#7ecab0] text-white" 
                  : "bg-black/[0.05] text-[#999]"
              }`}
            >
              {i}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="relative min-h-[460px]">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-10"
              >
                <h3 className="font-playfair text-2xl text-[#0d2b22] text-center mb-12">
                  What brings you here today?
                </h3>
                <div className="space-y-4">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`w-full p-6 text-left transition-all duration-300 relative overflow-hidden group ${
                        selectedService === s.id
                          ? "bg-[#f5f2ec]"
                          : "hover:bg-[#f5f2ec]/50"
                      }`}
                    >
                      {selectedService === s.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#7ecab0]" />
                      )}
                      <p className="font-sans text-[15px] font-medium text-[#0d2b22] mb-1">
                        {s.name}
                      </p>
                      <p className="font-sans text-[12px] text-[#888]">
                        {s.sub}
                      </p>
                    </button>
                  ))}
                </div>
                {selectedService && (
                  <div className="pt-8 text-center">
                    <button
                      onClick={() => setStep(2)}
                      className="px-10 py-3.5 bg-[#0d2b22] text-[#7ecab0] rounded-full font-sans text-[11px] uppercase tracking-widest font-medium transition-all hover:bg-[#1a4a38]"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-12"
              >
                <h3 className="font-playfair text-2xl text-[#0d2b22] text-center mb-12">
                  When works for you?
                </h3>
                
                {/* Date Strip */}
                <div className="flex justify-between items-center gap-1 overflow-x-auto pb-4 scrollbar-hide">
                  {days.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setSelectedDate(d.label)}
                      className={`flex-shrink-0 w-12 h-16 rounded-full flex flex-col items-center justify-center transition-all ${
                        selectedDate === d.label
                          ? "bg-[#0d2b22] text-[#7ecab0]"
                          : d.isToday
                          ? "bg-[#7ecab0]/10 text-[#7ecab0]"
                          : "bg-transparent text-[#999] hover:bg-black/[0.02]"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-sans mb-1">{d.short}</span>
                      <span className="text-[15px] font-playfair font-bold">{d.num}</span>
                    </button>
                  ))}
                </div>

                {/* Time Buttons */}
                <div className="flex justify-center gap-8 py-8 border-y border-black/[0.03]">
                  {timeRefs.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`font-sans text-[14px] transition-all py-1 px-4 rounded-md ${
                        selectedTime === t
                          ? "bg-[#0d2b22] text-white"
                          : "text-[#888] hover:text-[#0d2b22]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-3 bg-[#0d2b22] text-[#7ecab0] rounded-full font-sans text-[11px] uppercase tracking-widest font-medium transition-all"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(3)}
                    className="px-10 py-3.5 bg-[#0d2b22] text-[#7ecab0] rounded-full font-sans text-[11px] uppercase tracking-widest font-medium transition-all disabled:opacity-20"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-10"
              >
                <h3 className="font-playfair text-2xl text-[#0d2b22] text-center mb-12">
                  Almost there
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-sans text-[11px] text-[#999] uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full h-12 bg-white border-b border-black/[0.08] px-0 font-sans text-[15px] focus:border-[#7ecab0] outline-none transition-all placeholder:text-[#ddd]"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[11px] text-[#999] uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full h-12 bg-white border-b border-black/[0.08] px-0 font-sans text-[15px] focus:border-[#7ecab0] outline-none transition-all placeholder:text-[#ddd]"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[11px] text-[#999] uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="flex items-center border-b border-black/[0.08] focus-within:border-[#7ecab0] transition-all">
                      <span className="font-sans text-[15px] text-[#0d2b22] pr-2">+254</span>
                      <input
                        type="tel"
                        className="w-full h-12 bg-transparent px-0 font-sans text-[15px] outline-none transition-all placeholder:text-[#ddd]"
                        placeholder="7XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f2ec]/50 p-6 rounded-2xl italic font-sans text-xs text-[#888] leading-relaxed">
                  All consultations at Hope Counseling are strictly confidential. We adhere to clinical ethical standards to protect your privacy. By proceeding, you acknowledge that this is for non-emergency support. The first session is a free 45-minute alignment call.
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${
                    formData.agreed ? "bg-[#7ecab0] border-[#7ecab0]" : "border-black/[0.1] bg-white group-hover:border-[#7ecab0]/50"
                  }`}>
                    {formData.agreed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  />
                  <span className="font-sans text-[12px] text-[#666]">
                    I understand and accept the terms
                  </span>
                </label>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-[#0d2b22] text-[#7ecab0] rounded-full font-sans text-[11px] uppercase tracking-widest font-medium transition-all"
                  >
                    Back
                  </button>
                  <button
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.agreed}
                    onClick={handleWhatsApp}
                    className="px-10 py-3.5 bg-[#0d2b22] text-[#7ecab0] rounded-full font-sans text-[11px] uppercase tracking-widest font-medium shadow-xl shadow-[#0d2b22]/10 transition-all disabled:opacity-20"
                  >
                    Send to WhatsApp
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
