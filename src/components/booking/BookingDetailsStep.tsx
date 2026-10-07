"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ShieldCheck,
  Video,
  MapPin,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { SessionType, DeliveryMode, PublicSlotSummary } from "@/types/booking";
import { SERVICE_DETAILS } from "@/lib/booking-constants";

interface BookingDetailsStepProps {
  selectedDateStr: string;
  selectedSlot: PublicSlotSummary;
  onBack: () => void;
  onSubmit: (formData: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    sessionType: SessionType;
    deliveryMode: DeliveryMode;
    notes?: string;
    website_hp?: string;
  }) => Promise<void>;
  submitting: boolean;
  errorMessage: string | null;
}

export default function BookingDetailsStep({
  selectedDateStr,
  selectedSlot,
  onBack,
  onSubmit,
  submitting,
  errorMessage,
}: BookingDetailsStepProps) {
  const [sessionType, setSessionType] = useState<SessionType>("individual");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("online");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [websiteHp, setWebsiteHp] = useState(""); // Honeypot
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentService = SERVICE_DETAILS[sessionType] || SERVICE_DETAILS.individual;

  // Format date nicely
  const [year, month, day] = selectedDateStr.split("-").map(Number);
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim() || name.trim().length < 2) {
      setValidationError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setValidationError("Please enter a valid phone number (e.g. 0712 345 678).");
      return;
    }
    if (!acceptedTerms) {
      setValidationError("Please confirm your acknowledgment of confidentiality and terms.");
      return;
    }

    await onSubmit({
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      sessionType,
      deliveryMode,
      notes: notes.trim() || undefined,
      website_hp: websiteHp,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header */}
      <div className="text-center">
        <h3 className="font-playfair text-2xl text-[#0d2b22]">Session Details</h3>
        <p className="font-sans text-xs text-[#666] mt-1">
          Complete your information to confirm your reserved appointment.
        </p>
      </div>

      {/* Server Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="font-sans text-xs font-semibold text-red-800">{errorMessage}</p>
            <p className="font-sans text-[11px] text-red-600 mt-0.5">
              Please choose a different time slot or check your details.
            </p>
          </div>
        </div>
      )}

      {/* Client-side Validation Error */}
      {validationError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="font-sans text-xs text-amber-800 font-medium">{validationError}</p>
        </div>
      )}

      {/* Service Type Selection */}
      <div className="space-y-3">
        <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0d2b22] block">
          Select Therapy Focus
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(SERVICE_DETAILS) as SessionType[]).map((typeKey) => {
            const s = SERVICE_DETAILS[typeKey];
            const isSelected = sessionType === typeKey;
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => setSessionType(typeKey)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-[#0d2b22] text-white border-[#0d2b22] shadow-sm"
                    : "bg-white text-[#0d2b22] border-black/[0.08] hover:border-[#7ecab0]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-semibold">{s.name}</span>
                  <span
                    className={`font-sans text-xs font-bold ${
                      isSelected ? "text-[#7ecab0]" : "text-[#0d2b22]"
                    }`}
                  >
                    KSh {s.price.toLocaleString()}
                  </span>
                </div>
                <p
                  className={`font-sans text-[11px] mt-1 line-clamp-2 ${
                    isSelected ? "text-white/70" : "text-[#888]"
                  }`}
                >
                  {s.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode of Session (Online vs In-Person) */}
      <div className="space-y-3">
        <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0d2b22] block">
          Session Delivery
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDeliveryMode("online")}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
              deliveryMode === "online"
                ? "bg-[#0d2b22] text-white border-[#0d2b22]"
                : "bg-white text-[#0d2b22] border-black/[0.08] hover:border-[#7ecab0]"
            }`}
          >
            <Video className={`w-4 h-4 ${deliveryMode === "online" ? "text-[#7ecab0]" : "text-[#666]"}`} />
            <div className="text-left">
              <div className="font-sans text-xs font-semibold">Online Session</div>
              <div className={`font-sans text-[10px] ${deliveryMode === "online" ? "text-white/70" : "text-[#888]"}`}>
                Encrypted Video / Audio
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryMode("in_person")}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
              deliveryMode === "in_person"
                ? "bg-[#0d2b22] text-white border-[#0d2b22]"
                : "bg-white text-[#0d2b22] border-black/[0.08] hover:border-[#7ecab0]"
            }`}
          >
            <MapPin className={`w-4 h-4 ${deliveryMode === "in_person" ? "text-[#7ecab0]" : "text-[#666]"}`} />
            <div className="text-left">
              <div className="font-sans text-xs font-semibold">In-Person</div>
              <div className={`font-sans text-[10px] ${deliveryMode === "in_person" ? "text-white/70" : "text-[#888]"}`}>
                Nairobi Physical Clinic
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Client Contact Details */}
      <div className="space-y-4 pt-2">
        <div>
          <label className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#555] block mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah Mwangi"
            className="w-full h-11 px-3.5 rounded-xl bg-white border border-black/[0.1] font-sans text-sm text-[#0d2b22] focus:border-[#7ecab0] focus:ring-1 focus:ring-[#7ecab0] outline-none transition-all placeholder:text-[#bbb]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#555] block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah@example.com"
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-black/[0.1] font-sans text-sm text-[#0d2b22] focus:border-[#7ecab0] focus:ring-1 focus:ring-[#7ecab0] outline-none transition-all placeholder:text-[#bbb]"
            />
          </div>

          <div>
            <label className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#555] block mb-1">
              WhatsApp / Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX or +254..."
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-black/[0.1] font-sans text-sm text-[#0d2b22] focus:border-[#7ecab0] focus:ring-1 focus:ring-[#7ecab0] outline-none transition-all placeholder:text-[#bbb]"
              />
            </div>
            <div className="mt-1.5 p-2 rounded-lg bg-[#0d2b22]/[0.04] border border-[#7ecab0]/40 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d6e5a] mt-1 shrink-0" />
              <p className="font-sans text-[11px] text-[#0d2b22] font-medium leading-tight">
                <span className="font-semibold text-[#2d6e5a]">Verified WhatsApp Number:</span> Please ensure this is your active WhatsApp line (<span className="underline">Safaricom</span> or <span className="underline">Airtel</span>) so our practitioner can confirm your session and share consultation details.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#555] block mb-1">
            Optional Note for Counselor
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything you would like us to keep in mind prior to the session..."
            className="w-full p-3 rounded-xl bg-white border border-black/[0.1] font-sans text-xs text-[#0d2b22] focus:border-[#7ecab0] focus:ring-1 focus:ring-[#7ecab0] outline-none transition-all placeholder:text-[#bbb]"
          />
        </div>

        {/* Hidden Honeypot Input for Bot Detection */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website_hp"
            tabIndex={-1}
            autoComplete="off"
            value={websiteHp}
            onChange={(e) => setWebsiteHp(e.target.value)}
          />
        </div>
      </div>

      {/* Privacy Guarantee & Terms */}
      <div className="p-4 rounded-xl bg-[#0d2b22]/5 border border-[#0d2b22]/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0d2b22]">
          <ShieldCheck className="w-4 h-4 text-[#7ecab0]" />
          <span>Strict Clinical Confidentiality</span>
        </div>
        <p className="font-sans text-[11px] text-[#666] leading-relaxed">
          Your personal data is encrypted and handled exclusively by our licensed therapists.
          Details are never shared with third parties.
        </p>

        <label className="flex items-start gap-2.5 cursor-pointer pt-1 select-none">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 accent-[#0d2b22] rounded cursor-pointer"
          />
          <span className="font-sans text-xs text-[#444]">
            I understand that sessions are non-emergency and agree to the booking policies.
          </span>
        </label>
      </div>

      {/* Booking Summary Card & Sticky Confirm Bar */}
      <div className="bg-white rounded-2xl border border-black/[0.08] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
          <span className="font-sans text-xs uppercase tracking-wider text-[#888] font-semibold">
            Appointment Summary
          </span>
          <span className="font-sans text-xs px-2.5 py-0.5 rounded-full bg-[#7ecab0]/20 text-[#0d2b22] font-semibold">
            {deliveryMode === "online" ? "Online Video" : "In-Person Clinic"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[#888] font-sans flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7ecab0]" /> Date
            </span>
            <span className="font-sans font-semibold text-[#0d2b22] block">{formattedDate}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[#888] font-sans flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7ecab0]" /> Time
            </span>
            <span className="font-sans font-semibold text-[#0d2b22] block">
              {selectedSlot.timeFormatted} EAT
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-[#888] block">Session Fee</span>
            <span className="font-playfair text-xl font-bold text-[#0d2b22]">
              KSh {currentService.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              disabled={submitting}
              className="px-4 py-2.5 rounded-full border border-black/10 text-[#0d2b22] text-xs font-semibold hover:bg-black/5 transition-colors disabled:opacity-40"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-full bg-[#0d2b22] text-[#7ecab0] hover:bg-[#1a4a38] text-xs uppercase tracking-wider font-bold transition-all shadow-md shadow-[#0d2b22]/15 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing Slot...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
