"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { id: "stress", name: "Stress & Anxiety", icon: "🧘" },
  { id: "relationship", name: "Relationship", icon: "👫" },
  { id: "youth", name: "Youth Mentorship", icon: "🌱" },
  { id: "academic", name: "Academic", icon: "📚" },
  { id: "peer", name: "Peer Support", icon: "🤝" },
];

const timeSlots = {
  morning: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"],
  afternoon: ["02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
  evening: ["06:00 PM", "07:00 PM", "08:00 PM"],
};

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
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
        full: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        num: date.getDate(),
      });
    }
    return d;
  }, []);

  const handleWhatsApp = () => {
    const serviceName = services.find(s => s.id === selectedService)?.name;
    const message = `Hello Hope Counseling,\n\nI would like to book a session:\n\n*Service:* ${serviceName}\n*Date:* ${selectedDate}\n*Time:* ${selectedTimeSlot}\n\n*Details:*\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}`;
    window.open(`https://wa.me/254701279231?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section id="book" className="py-20 md:py-32 bg-[#f9f7f4]">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] mb-3 block font-medium">
            Online Booking
          </span>
          <h2 className="font-playfair text-3xl md:text-[42px] text-[#0d2b22] leading-tight mb-12">
            Begin Your <span className="italic">Journey</span>
          </h2>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs transition-colors duration-500 ${
                    step >= i ? "bg-[#0d2b22] text-[#7ecab0]" : "bg-white text-[#666] border border-black/5"
                  }`}
                >
                  {i}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-[1px] ${step > i ? "bg-[#0d2b22]" : "bg-black/5"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-black/[0.03] overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                <h3 className="font-playfair text-xl text-[#0d2b22] mb-8">Choose Your Service</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
                        selectedService === s.id
                          ? "border-[#7ecab0] bg-[#7ecab0]/5 ring-1 ring-[#7ecab0]"
                          : "border-black/[0.05] hover:border-[#7ecab0]/40"
                      }`}
                    >
                      <span className="text-2xl mb-4 block">{s.icon}</span>
                      <span className="font-sans text-sm font-medium text-[#0d2b22] uppercase tracking-wide">
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedService}
                  onClick={nextStep}
                  className="w-full py-4 bg-[#0d2b22] text-[#7ecab0] rounded-[30px] font-sans font-medium uppercase tracking-widest text-xs disabled:opacity-30 transition-all hover:bg-[#1a4a38]"
                >
                  Next Step
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                <h3 className="font-playfair text-xl text-[#0d2b22] mb-8">Select a Date & Time</h3>
                
                {/* Date Grid */}
                <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                  {days.map((d) => (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d.full)}
                      className={`flex-shrink-0 w-16 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                        selectedDate === d.full
                          ? "border-[#7ecab0] bg-[#0d2b22] text-[#7ecab0]"
                          : "border-black/[0.05] bg-white text-[#666]"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-medium">{d.day}</span>
                      <span className="text-lg font-playfair font-bold">{d.num}</span>
                    </button>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="space-y-8 mb-10">
                  {Object.entries(timeSlots).map(([period, slots]) => (
                    <div key={period}>
                      <span className="font-sans text-[10px] uppercase tracking-widest text-[#666] mb-4 block underline decoration-[#7ecab0]/30 underline-offset-4">
                        {period}
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {slots.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTimeSlot(t)}
                            className={`py-3 rounded-xl border font-sans text-xs transition-all ${
                              selectedTimeSlot === t
                                ? "border-[#7ecab0] bg-[#7ecab0]/10 text-[#0d2b22] font-medium"
                                : "border-black/[0.05] hover:border-[#7ecab0]/40 text-[#666]"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-4 border border-black/10 rounded-[30px] font-sans text-xs uppercase tracking-widest text-[#666]"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedDate || !selectedTimeSlot}
                    onClick={nextStep}
                    className="flex-[2] py-4 bg-[#0d2b22] text-[#7ecab0] rounded-[30px] font-sans font-medium uppercase tracking-widest text-xs disabled:opacity-30"
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
                className="p-8 md:p-12"
              >
                <h3 className="font-playfair text-xl text-[#0d2b22] mb-8">Personal Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-[#666]">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-[#f9f7f4] border-none rounded-2xl font-sans text-sm focus:ring-1 ring-[#7ecab0] outline-none"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-[#666]">Email</label>
                    <input
                      type="email"
                      className="w-full p-4 bg-[#f9f7f4] border-none rounded-2xl font-sans text-sm focus:ring-1 ring-[#7ecab0] outline-none"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-[#666]">Phone (WhatsApp)</label>
                    <input
                      type="tel"
                      className="w-full p-4 bg-[#f9f7f4] border-none rounded-2xl font-sans text-sm focus:ring-1 ring-[#7ecab0] outline-none"
                      placeholder="+254..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-10">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-[#666] mb-2 block">Confidentiality Agreement</label>
                  <div className="h-32 overflow-y-auto p-4 bg-[#f9f7f4] rounded-2xl font-sans text-[11px] text-[#888] leading-relaxed mb-4">
                    All consultations at Hope Counseling are strictly confidential. We adhere to clinical ethical standards to protect your privacy. By proceeding, you acknowledge that this is for non-emergency psychological support. If you are in crisis, please contact emergency services. Standard sessions are 45 minutes of dedicated professional support.
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-black/10 text-[#7ecab0] focus:ring-[#7ecab0]"
                      checked={formData.agreed}
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    />
                    <span className="font-sans text-[11px] text-[#666] group-hover:text-[#0d2b22] transition-colors">
                      I understand and agree to the terms
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-4 border border-black/10 rounded-[30px] font-sans text-xs uppercase tracking-widest text-[#666]"
                  >
                    Back
                  </button>
                  <button
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.agreed}
                    onClick={handleWhatsApp}
                    className="flex-[2] py-4 bg-[#0d2b22] text-[#7ecab0] rounded-[30px] font-sans font-medium uppercase tracking-widest text-xs disabled:opacity-30 flex items-center justify-center gap-2"
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
