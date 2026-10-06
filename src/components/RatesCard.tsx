"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SessionRate {
  id: string;
  emoji: string;
  title: string;
  duration: string;
  price: number;
  priceLabel: string;
  category: "session" | "package";
  badge?: string;
  description: string;
  highlights: string[];
}

const sessionRates: SessionRate[] = [
  {
    id: "individual",
    emoji: "🌷",
    title: "Individual Counselling",
    duration: "50–60 minutes",
    price: 1000,
    priceLabel: "KSh 1,000",
    category: "session",
    description: "One-on-one psychological counseling tailored to personal challenges, anxiety, stress, and self-discovery.",
    highlights: ["In-person & online", "Personalized therapy goals", "Strict confidentiality"],
  },
  {
    id: "online",
    emoji: "💻",
    title: "Online Counselling",
    duration: "50–60 minutes",
    price: 800,
    priceLabel: "KSh 800",
    category: "session",
    badge: "Flexible",
    description: "Accessible, confidential video or voice sessions from the privacy and comfort of your home anywhere in Kenya.",
    highlights: ["Secure video/voice link", "Flexible scheduling", "Zero travel needed"],
  },
  {
    id: "student",
    emoji: "🎓",
    title: "Student & Young Adult Support",
    duration: "50–60 minutes",
    price: 700,
    priceLabel: "KSh 700",
    category: "session",
    badge: "Subsidized",
    description: "Dedicated guidance for teenagers and tertiary students dealing with academic pressure, identity, and life transitions.",
    highlights: ["Student-friendly rate", "Stress & exam coping", "Non-judgmental ear"],
  },
  {
    id: "couples",
    emoji: "💕",
    title: "Couples / Relationship Counselling",
    duration: "60 minutes",
    price: 1500,
    priceLabel: "KSh 1,500",
    category: "session",
    description: "Collaborative sessions to rebuild communication, navigate conflict, restore intimacy, and strengthen mutual understanding.",
    highlights: ["Joint 60-min session", "Constructive dialogue tools", "Neutral facilitated space"],
  },
  {
    id: "initial",
    emoji: "🌱",
    title: "Initial Consultation",
    duration: "30 minutes",
    price: 300,
    priceLabel: "KSh 300",
    category: "session",
    badge: "Discovery",
    description: "A gentle introductory session to discuss your concerns, ask questions, and determine if our approach aligns with your needs.",
    highlights: ["Gentle low-pressure start", "Explore therapeutic fit", "Care plan outline"],
  },
];

interface PackageRate {
  id: string;
  emoji: string;
  title: string;
  sessions: string;
  duration: string;
  price: number;
  priceLabel: string;
  perSession: string;
  savings?: string;
  popular?: boolean;
  description: string;
  forWhom: string;
  features: string[];
}

const packageRates: PackageRate[] = [
  {
    id: "student-pkg",
    emoji: "🎓",
    title: "Student Wellness Package",
    sessions: "4 sessions",
    duration: "50–60 minutes per session",
    price: 2500,
    priceLabel: "KSh 2,500",
    perSession: "KSh 625 / session",
    savings: "Save KSh 300",
    description: "For students navigating academic pressure, stress, relationships, self-esteem, emotional wellbeing and personal growth.",
    forWhom: "Secondary & university students seeking sustainable coping mechanisms through the academic term.",
    features: [
      "4 structured 50-60 min sessions",
      "Academic stress & exam anxiety tools",
      "Self-esteem & identity building",
      "Flexible student-friendly scheduling",
    ],
  },
  {
    id: "personal-pkg",
    emoji: "🌸",
    title: "Personal Growth Package",
    sessions: "4 sessions",
    duration: "50–60 minutes per session",
    price: 3600,
    priceLabel: "KSh 3,600",
    perSession: "KSh 900 / session",
    savings: "Save KSh 400",
    popular: true,
    description: "Ideal for clients who would like consistent support while working through personal, emotional or life-transition concerns.",
    forWhom: "Individuals seeking sustained emotional grounding and consistent weekly progress.",
    features: [
      "4 focused 50-60 min sessions",
      "In-depth emotional pattern exploration",
      "Personalized cognitive exercises",
      "Priority follow-up & check-ins",
    ],
  },
  {
    id: "extended-pkg",
    emoji: "🤍",
    title: "Extended Support Package",
    sessions: "6 sessions",
    duration: "50–60 minutes per session",
    price: 5000,
    priceLabel: "KSh 5,000",
    perSession: "KSh 833 / session",
    savings: "Save KSh 1,000",
    description: "Designed for clients who prefer ongoing support and want more time to work towards their counselling goals.",
    forWhom: "Clients working through deeper transformations, grief, relational trauma, or comprehensive self-realization.",
    features: [
      "6 comprehensive 50-60 min sessions",
      "Deep therapeutic trajectory",
      "Ongoing milestone & goal reviews",
      "Best per-session value (KSh 833/ea)",
    ],
  },
];

export default function RatesCard() {
  const [activeTab, setActiveTab] = useState<"all" | "sessions" | "packages">("all");

  const buildWhatsAppLink = (serviceName: string, rate: string) => {
    const text = `Hello Hope Counseling, I would like to book the "${serviceName}" (${rate}). Could you share the next available dates?`;
    return `https://wa.me/254701279231?text=${encodeURIComponent(text)}`;
  };

  const handleBookNow = (serviceId: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("hope:select-service", { detail: { serviceId } })
      );
      const bookElem = document.getElementById("book");
      if (bookElem) {
        bookElem.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = "book";
      }
    }
  };

  return (
    <section id="rates" className="py-24 md:py-32 bg-[#f9f7f4] relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7ecab0]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#0d2b22]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0f4ec] text-[#1e5c45] font-sans text-[11px] font-semibold tracking-wider uppercase mb-4">
            <span>🌸</span>
            <span>Counselling Services & Rates</span>
          </div>
          <h2 className="font-instrument text-4xl sm:text-5xl md:text-[58px] text-[#0d2b22] leading-[1.1] mb-6">
            Transparent Rates, <br />
            <span className="italic text-[#2d6e5a]">Compassionate Care.</span>
          </h2>
          <p className="font-sans text-sm md:text-base text-[#666] leading-relaxed max-w-2xl mx-auto">
            High quality psychological guidance designed to be open, accessible, and structured around your personal needs and rhythm.
          </p>

          {/* Filter Pills */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-full text-xs font-sans font-medium transition-all ${
                activeTab === "all"
                  ? "bg-[#0d2b22] text-white shadow-md shadow-[#0d2b22]/10"
                  : "bg-white text-[#555] hover:bg-[#eef3f0] border border-black/[0.05]"
              }`}
            >
              All Options
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-5 py-2 rounded-full text-xs font-sans font-medium transition-all ${
                activeTab === "sessions"
                  ? "bg-[#0d2b22] text-white shadow-md shadow-[#0d2b22]/10"
                  : "bg-white text-[#555] hover:bg-[#eef3f0] border border-black/[0.05]"
              }`}
            >
              🌷 Single Sessions
            </button>
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-5 py-2 rounded-full text-xs font-sans font-medium transition-all ${
                activeTab === "packages"
                  ? "bg-[#0d2b22] text-white shadow-md shadow-[#0d2b22]/10"
                  : "bg-white text-[#555] hover:bg-[#eef3f0] border border-black/[0.05]"
              }`}
            >
              🎀 Counselling Packages
            </button>
          </div>
        </div>

        {/* Section 1: Single Sessions */}
        {(activeTab === "all" || activeTab === "sessions") && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xl">🌸</span>
              <h3 className="font-instrument text-2xl md:text-3xl text-[#0d2b22]">
                Counselling Services & Individual Sessions
              </h3>
              <div className="h-[1px] bg-black/[0.08] flex-grow ml-4 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessionRates.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 md:p-7 border border-black/[0.06] hover:border-[#7ecab0]/50 shadow-sm hover:shadow-xl hover:shadow-[#0d2b22]/5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-2xl p-2.5 rounded-xl bg-[#f9f7f4] group-hover:scale-110 transition-transform duration-300">
                        {item.emoji}
                      </span>
                      {item.badge && (
                        <span className="font-sans text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full bg-[#e0f4ec] text-[#1e5c45] tracking-wider">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="font-instrument text-xl text-[#0d2b22] mb-1 group-hover:text-[#2d6e5a] transition-colors">
                      {item.title}
                    </h4>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-sans text-2xl font-semibold text-[#0d2b22]">
                        {item.priceLabel}
                      </span>
                      <span className="font-sans text-xs text-[#888]">
                        / {item.duration}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-[#666] leading-relaxed mb-6">
                      {item.description}
                    </p>

                    <ul className="space-y-2 mb-6 pt-4 border-t border-black/[0.04]">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] font-sans text-[#555]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7ecab0]" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleBookNow(item.id)}
                      className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#0d2b22] text-[#7ecab0] hover:bg-[#1a4a38] font-sans text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm"
                    >
                      Book This Session →
                    </button>
                    <a
                      href={buildWhatsAppLink(item.title, item.priceLabel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Quick message on WhatsApp"
                      className="py-2.5 px-3 rounded-xl border border-[#0d2b22]/15 text-[#0d2b22] hover:bg-[#0d2b22] hover:text-white text-xs transition-colors flex items-center justify-center"
                    >
                      💬
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Counselling Packages */}
        {(activeTab === "all" || activeTab === "packages") && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xl">🎀</span>
              <div>
                <h3 className="font-instrument text-2xl md:text-3xl text-[#0d2b22]">
                  Counselling Packages
                </h3>
                <p className="font-sans text-xs text-[#777] mt-1">
                  Structured multi-session pathways designed for continuous progress and greater savings.
                </p>
              </div>
              <div className="h-[1px] bg-black/[0.08] flex-grow ml-4 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {packageRates.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                    pkg.popular
                      ? "bg-[#0d2b22] text-[#f5f2ec] shadow-2xl shadow-[#0d2b22]/20 border-2 border-[#7ecab0]/40"
                      : "bg-white text-[#222] border border-black/[0.06] shadow-sm hover:shadow-xl"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-[#7ecab0] text-[#0d2b22] font-sans text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{pkg.emoji}</span>
                      {pkg.savings && (
                        <span
                          className={`font-sans text-[11px] font-semibold px-3 py-1 rounded-full ${
                            pkg.popular
                              ? "bg-white/10 text-[#a8e6cf]"
                              : "bg-[#e0f4ec] text-[#1e5c45]"
                          }`}
                        >
                          {pkg.savings}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`font-instrument text-2xl leading-snug mb-1 ${
                        pkg.popular ? "text-white" : "text-[#0d2b22]"
                      }`}
                    >
                      {pkg.title}
                    </h4>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span
                        className={`font-sans text-3xl font-bold ${
                          pkg.popular ? "text-[#a8e6cf]" : "text-[#0d2b22]"
                        }`}
                      >
                        {pkg.priceLabel}
                      </span>
                      <span
                        className={`font-sans text-xs ${
                          pkg.popular ? "text-white/60" : "text-[#888]"
                        }`}
                      >
                        / {pkg.sessions}
                      </span>
                    </div>

                    <div
                      className={`font-sans text-[11px] font-medium tracking-wide mb-6 ${
                        pkg.popular ? "text-white/70" : "text-[#666]"
                      }`}
                    >
                      <span>{pkg.duration}</span>
                      <span className="mx-2">•</span>
                      <span>{pkg.perSession}</span>
                    </div>

                    <p
                      className={`font-sans text-xs leading-relaxed mb-4 italic ${
                        pkg.popular ? "text-white/80" : "text-[#555]"
                      }`}
                    >
                      "{pkg.description}"
                    </p>

                    <div
                      className={`p-3.5 rounded-xl mb-6 text-[11px] font-sans ${
                        pkg.popular
                          ? "bg-white/5 border border-white/10 text-white/80"
                          : "bg-[#f9f7f4] text-[#666]"
                      }`}
                    >
                      <span className="font-semibold block mb-0.5">Best Suited For:</span>
                      {pkg.forWhom}
                    </div>

                    <ul className="space-y-2.5 mb-8">
                      {pkg.features.map((feat, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-2.5 text-xs font-sans ${
                            pkg.popular ? "text-white/90" : "text-[#444]"
                          }`}
                        >
                          <svg
                            className={`w-4 h-4 shrink-0 ${
                              pkg.popular ? "text-[#7ecab0]" : "text-[#2d6e5a]"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookNow(pkg.id)}
                      className={`flex-1 py-3.5 px-5 rounded-full font-sans text-xs font-semibold tracking-wider uppercase text-center transition-all duration-300 ${
                        pkg.popular
                          ? "bg-[#7ecab0] text-[#0d2b22] hover:bg-[#a8e6cf] hover:shadow-lg hover:shadow-[#7ecab0]/20"
                          : "bg-[#0d2b22] text-white hover:bg-[#1a4a38]"
                      }`}
                    >
                      Select Package →
                    </button>
                    <a
                      href={buildWhatsAppLink(pkg.title, pkg.priceLabel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Quick question on WhatsApp"
                      className={`px-4 rounded-full flex items-center justify-center transition-all ${
                        pkg.popular
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "border border-black/15 text-[#0d2b22] hover:bg-[#f5f2ec]"
                      }`}
                    >
                      💬
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: BOOK A SESSION Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d2b22] via-[#133e31] to-[#0a231b] text-white p-8 sm:p-12 md:p-16 border border-white/10 shadow-2xl"
        >
          {/* Subtle floral watermark */}
          <div className="absolute right-[-20px] bottom-[-20px] text-[180px] opacity-[0.03] select-none pointer-events-none font-instrument leading-none">
            🌸
          </div>

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#a8e6cf] font-sans text-[11px] font-semibold tracking-widest uppercase mb-6">
              <span>💌</span>
              <span>Book a Session</span>
            </div>

            <h3 className="font-instrument text-3xl sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
              Choose the option that works best for you and send a message to schedule your session.
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs font-sans text-white/80">
              <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                <span className="text-base">📍</span>
                <span>Online & in-person sessions available.</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                <span className="text-base">🔒</span>
                <span>All sessions are approached with confidentiality, empathy and without judgment.</span>
              </div>
            </div>

            {/* Emotional Anchor Quote */}
            <div className="border-l-2 border-[#7ecab0] pl-5 py-2 mb-10">
              <p className="font-instrument italic text-2xl sm:text-3xl text-[#a8e6cf] leading-snug">
                "🌷 You don't have to figure everything out alone."
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/254701279231?text=Hello%20Hope%20Counseling,%20I%20would%20like%20to%20schedule%20a%20counselling%20session."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full bg-[#7ecab0] hover:bg-[#a8e6cf] text-[#0d2b22] font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#7ecab0]/20 flex items-center gap-2"
              >
                <span>💬</span>
                <span>Send a WhatsApp Message</span>
              </a>

              <a
                href="#book"
                className="px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-sans text-xs font-medium uppercase tracking-wider transition-all duration-300"
              >
                Schedule via Online Form
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
