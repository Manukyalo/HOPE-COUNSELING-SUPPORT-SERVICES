"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ContactContent() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Stress & Anxiety",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormState("success");
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f9f7f4] pt-32 pb-20"
    >
      {/* HERO SECTION */}
      <section className="container mx-auto px-6 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-4 block font-medium">
            Get in Touch
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl text-[#0d2b22] mb-6 leading-tight">
            We're here when you're ready
          </h1>
          <p className="font-sans text-[15px] text-[#666] max-w-xl mx-auto font-light leading-relaxed">
            No forms, no waiting lists. Just a real conversation.
          </p>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
          
          {/* LEFT COLUMN: Contact Form */}
          <div className="bg-white rounded-[30px] p-8 md:p-12 shadow-sm border border-black/[0.03]">
            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-[#e8f5f0] text-[#2d6e5a] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                    ✓
                  </div>
                  <h3 className="font-playfair text-2xl text-[#0d2b22] mb-3">Message Sent</h3>
                  <p className="font-sans text-sm text-[#666] leading-relaxed max-w-xs mx-auto">
                    Thank you for reaching out. We've received your message and will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setFormState("idle")}
                    className="mt-8 text-[11px] uppercase tracking-widest text-[#7ecab0] font-medium hover:text-[#0d2b22] transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="font-sans text-[11px] uppercase tracking-widest text-[#0d2b22]/40 ml-1">Your Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-[#f9f7f4] border-none rounded-xl px-5 py-4 font-sans text-sm focus:ring-1 focus:ring-[#7ecab0] transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-sans text-[11px] uppercase tracking-widest text-[#0d2b22]/40 ml-1">Email Address</label>
                      <input
                        required
                        type="email"
                        className="w-full bg-[#f9f7f4] border-none rounded-xl px-5 py-4 font-sans text-sm focus:ring-1 focus:ring-[#7ecab0] transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-sans text-[11px] uppercase tracking-widest text-[#0d2b22]/40 ml-1">Phone Number</label>
                      <input
                        required
                        type="tel"
                        placeholder="+254..."
                        className="w-full bg-[#f9f7f4] border-none rounded-xl px-5 py-4 font-sans text-sm focus:ring-1 focus:ring-[#7ecab0] transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-sans text-[11px] uppercase tracking-widest text-[#0d2b22]/40 ml-1">What you'd like help with</label>
                    <select
                      className="w-full bg-[#f9f7f4] border-none rounded-xl px-5 py-4 font-sans text-sm focus:ring-1 focus:ring-[#7ecab0] transition-all appearance-none"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      <option>Stress & Anxiety</option>
                      <option>Relationship Counseling</option>
                      <option>Youth Mentorship</option>
                      <option>Academic Guidance</option>
                      <option>Emotional Support</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-sans text-[11px] uppercase tracking-widest text-[#0d2b22]/40 ml-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Feel free to share as little or as much as you're comfortable with."
                      className="w-full bg-[#f9f7f4] border-none rounded-xl px-5 py-4 font-sans text-sm focus:ring-1 focus:ring-[#7ecab0] transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      disabled={formState === "submitting"}
                      type="submit"
                      className="w-full md:w-auto px-10 py-4 bg-[#0d2b22] text-white rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#1a4a38] transition-all disabled:opacity-50"
                    >
                      {formState === "submitting" ? "Sending..." : "Send Message"}
                    </button>
                    <p className="mt-6 font-sans text-[12px] text-[#888] italic leading-relaxed">
                      We typically respond within a few hours during working hours. <br className="hidden md:block" />
                      For faster responses, reach us directly on WhatsApp.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Contact Details */}
          <div className="space-y-12 py-4">
            <div className="space-y-8">
              {/* Phone */}
              <div className="pl-6 border-l-2 border-[#7ecab0] space-y-1">
                <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] font-medium">Call or WhatsApp</span>
                <Link href="tel:+254701279231" className="block font-playfair text-xl md:text-2xl text-[#0d2b22] hover:text-[#7ecab0] transition-colors">+254 701 279 231</Link>
                <p className="font-sans text-[12px] text-[#888]">Available Mon–Fri, 8am–6pm</p>
              </div>

              {/* Email */}
              <div className="pl-6 border-l-2 border-[#7ecab0] space-y-1">
                <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] font-medium">Email</span>
                <Link href="mailto:amayakari5924@gmail.com" className="block font-playfair text-xl md:text-2xl text-[#0d2b22] hover:text-[#7ecab0] transition-colors">amayakari5924@gmail.com</Link>
                <p className="font-sans text-[12px] text-[#888]">For non-urgent enquiries</p>
              </div>

              {/* Location */}
              <div className="pl-6 border-l-2 border-[#7ecab0] space-y-1">
                <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] font-medium">Where we are</span>
                <p className="block font-playfair text-xl md:text-2xl text-[#0d2b22]">Thika, Kiambu County, Kenya</p>
                <p className="font-sans text-[12px] text-[#888]">Exact address shared on booking confirmation</p>
              </div>

              {/* WhatsApp Button */}
              <div className="pt-4">
                <Link 
                  href="https://wa.me/254701279231?text=Hi%2C%20I%27d%20like%20to%20get%20in%20touch%20with%20Hope%20Counseling."
                  target="_blank"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#e8f5f0] text-[#2d6e5a] rounded-full font-sans text-[11px] uppercase tracking-widest font-semibold hover:bg-[#d1e9df] transition-all"
                >
                  Chat on WhatsApp <span className="text-base text-[#7ecab0]">→</span>
                </Link>
              </div>
            </div>

            {/* Working Hours Block */}
            <div className="bg-white p-8 rounded-2xl border border-black/[0.03] space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-sans text-[#666]">Monday – Friday</span>
                  <span className="font-sans font-medium text-[#0d2b22]">8:00am – 6:00pm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-sans text-[#666]">Saturday</span>
                  <span className="font-sans font-medium text-[#0d2b22]">9:00am – 1:00pm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-sans text-[#666]">Sunday</span>
                  <span className="font-sans font-medium text-[#c0392b]">Closed</span>
                </div>
              </div>
              <p className="font-sans text-[11px] text-[#888] border-t border-black/[0.03] pt-4">
                Online sessions available outside these hours by arrangement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GOOGLE MAPS SECTION */}
      <section className="container mx-auto px-6 mt-20 md:mt-32">
        <div className="space-y-8">
          <h2 className="font-playfair text-2xl text-[#0d2b22]">Find Us</h2>
          <div className="w-full h-[320px] rounded-[16px] overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=Thika,Kenya&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hope Counseling Location - Thika"
            ></iframe>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
