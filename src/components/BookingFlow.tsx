"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { id: "stress-anxiety-management", name: "Stress & Anxiety", icon: "🧘", desc: "Master tools to navigate life's pressures and find calm." },
  { id: "relationship-counseling", name: "Relationship Counseling", icon: "👫", desc: "Foster deeper connections through expert guidance." },
  { id: "youth-mentorship", name: "Youth Mentorship", icon: "🌱", desc: "Empowering next-gen with confidence and clarity." },
  { id: "academic-guidance", name: "Academic Guidance", icon: "📚", desc: "Overcome learning challenges with strategic development." },
  { id: "emotional-peer-support", name: "Emotional & Peer Support", icon: "🤝", desc: "A safe space for connection and mutual understanding." },
];

const timePeriods = [
  { id: "Morning", label: "Morning (8am–12pm)" },
  { id: "Afternoon", label: "Afternoon (12pm–5pm)" },
  { id: "Evening", label: "Evening (5pm–8pm)" },
];

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agreed: false,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const days = useMemo(() => {
    const d = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      d.push({
        full: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        short: date.toLocaleDateString("en-US", { weekday: "short" }),
        num: date.getDate(),
        isToday: i === 0,
      });
    }
    return d;
  }, []);

  const handleWhatsApp = () => {
    const serviceName = services.find(s => s.id === selectedService)?.name;
    const baseUrl = "https://wa.me/254701279231";
    const text = `Hello, I'd like to book a ${serviceName} session on ${selectedDate} (${selectedPeriod}). My name is ${formData.name}.`;
    window.open(`${baseUrl}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="book" className="py-20 md:py-32 bg-[#f9f7f4]">
      <div className="container mx-auto px-6 max-w-[560px]">
        <div className="text-center mb-12">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-3 block font-medium">
            Schedule a Free Consultation
          </span>
          <h2 className="font-playfair text-3xl text-[#0d2b22] mb-4">
            Your first session is <span className="italic">free</span>.
          </h2>
          <p className="font-sans text-[11px] text-[#666] uppercase tracking-widest">
            No commitment required.
          </p>
        </div>

        {/* Progress Display */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#666]">
              Step {step} of 3
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    step === i ? "bg-[#7ecab0] w-6" : step > i ? "bg-[#7ecab0]" : "bg-black/[0.05]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-black/[0.02] overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-10"
              >
                <h3 className="font-playfair text-xl text-[#0d2b22] mb-8">Choose Your Service</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 group ${
                        selectedService === s.id
                          ? "border-[#7ecab0] bg-[#7ecab0]/5"
                          : "border-black/[0.05] hover:border-[#7ecab0]/40"
                      }`}
                    >
                      <span className="text-2xl mb-4 block">{s.icon}</span>
                      <p className="font-sans text-xs font-semibold text-[#0d2b22] uppercase tracking-wide mb-1 leading-tight">
                        {s.name}
                      </p>
                      <p className="font-sans text-[10px] text-[#666] leading-relaxed">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
                {selectedService && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={nextStep}
                    className="w-full h-12 bg-[#0d2b22] text-[#7ecab0] rounded-[12px] font-sans font-medium uppercase tracking-widest text-[10px] transition-all hover:bg-[#1a4a38]"
                  >
                    Next Step →
                  </motion.button>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-10"
              >
                <h3 className="font-playfair text-xl text-[#0d2b22] mb-8">Pick a Date & Time</h3>
                
                <div className="flex gap-2 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                  {days.map((d) => (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d.full)}
                      className={`flex-shrink-0 w-14 h-18 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        selectedDate === d.full
                          ? "border-[#7ecab0] bg-[#0d2b22] text-[#7ecab0]"
                          : "border-black/[0.05] bg-white text-[#666]"
                      }`}
                    >
                      <span className="text-[9px] uppercase font-medium mb-1">{d.short}</span>
                      <span className="text-base font-playfair font-bold">{d.num}</span>
                      {d.isToday && <div className="w-1 h-1 bg-[#7ecab0] rounded-full mt-1" />}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 mb-10">
                  {timePeriods.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPeriod(p.label)}
                      className={`w-full py-4 px-6 rounded-xl border font-sans text-xs transition-all text-left flex justify-between items-center ${
                        selectedPeriod === p.label
                          ? "border-[#7ecab0] bg-[#7ecab0]/10 text-[#0d2b22] font-medium"
                          : "border-black/[0.05] hover:border-[#7ecab0]/40 text-[#666]"
                      }`}
                    >
                      {p.label}
                      {selectedPeriod === p.label && <div className="w-2 h-2 bg-[#7ecab0] rounded-full" />}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 h-12 border border-black/10 rounded-[12px] font-sans text-[10px] uppercase tracking-widest text-[#666] hover:bg-black/[0.02]"
                  >
                    ← Back
                  </button>
                  <button
                    disabled={!selectedDate || !selectedPeriod}
                    onClick={nextStep}
                    className="flex-[2] h-12 bg-[#0d2b22] text-[#7ecab0] rounded-[12px] font-sans font-medium uppercase tracking-widest text-[10px] disabled:opacity-30 transition-all"
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-10"
              >
                <h3 className="font-playfair text-xl text-[#0d2b22] mb-8">Your Details</h3>
                
                <div className="space-y-4 mb-8 text-left">
                  <div className="space-y-1.5">
                    <label className="font-sans text-[9px] uppercase tracking-widest text-[#666] ml-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full h-12 px-5 bg-[#f9f7f4] border border-black/[0.05] rounded-xl font-sans text-sm focus:border-[#7ecab0] outline-none transition-all placeholder:text-[#ccc]"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-sans text-[9px] uppercase tracking-widest text-[#666] ml-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full h-12 px-5 bg-[#f9f7f4] border border-black/[0.05] rounded-xl font-sans text-sm focus:border-[#7ecab0] outline-none transition-all placeholder:text-[#ccc]"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-sans text-[9px] uppercase tracking-widest text-[#666] ml-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full h-12 px-5 bg-[#f9f7f4] border border-black/[0.05] rounded-xl font-sans text-sm focus:border-[#7ecab0] outline-none transition-all placeholder:text-[#ccc]"
                      placeholder="+254 7XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-10 text-left">
                  <span className="font-sans text-[9px] uppercase tracking-widest text-[#666] ml-1 mb-2 block">Confidentiality Agreement</span>
                  <div className="max-h-[120px] overflow-y-scroll p-4 bg-[#f9f7f4] rounded-xl font-sans text-[11px] text-[#888] leading-relaxed mb-4 scrollbar-thin">
                    All consultations at Hope Counseling are strictly confidential. We adhere to clinical ethical standards to protect your privacy and maintain the highest level of professional boundary. By proceeding, you acknowledge that this is for non-emergency psychological support. If you are in crisis, please contact emergency medical services or visit the nearest hospital. The first session is a free 45-minute consultation to assess needs and alignment.
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-black/10 text-[#7ecab0] focus:ring-[#7ecab0] accent-[#7ecab0]"
                      checked={formData.agreed}
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    />
                    <span className="font-sans text-[11px] text-[#666] group-hover:text-[#0d2b22] transition-colors">
                      I understand and accept the above terms
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 h-12 border border-black/10 rounded-[12px] font-sans text-[10px] uppercase tracking-widest text-[#666]"
                  >
                    ← Back
                  </button>
                  <button
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.agreed}
                    onClick={handleWhatsApp}
                    className="flex-[2] h-12 bg-[#0d2b22] text-[#7ecab0] rounded-[12px] font-sans font-medium uppercase tracking-widest text-[10px] disabled:opacity-30 transition-all shadow-lg shadow-[#0d2b22]/10"
                  >
                    Confirm via WhatsApp
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
