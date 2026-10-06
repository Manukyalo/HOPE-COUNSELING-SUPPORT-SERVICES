"use client";

import React from "react";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  ShieldCheck,
  MessageCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { BookingCreationResult } from "@/types/booking";

interface BookingConfirmationStepProps {
  result: BookingCreationResult;
  onReset: () => void;
}

export default function BookingConfirmationStep({
  result,
  onReset,
}: BookingConfirmationStepProps) {
  const booking = result.booking;
  if (!booking) return null;

  // Generate Google Calendar Link
  const gCalTitle = encodeURIComponent(`Hope Counseling Session (${booking.sessionType})`);
  const gCalDetails = encodeURIComponent(
    `Confidential therapy appointment with Hope Counseling Support Services.\nReference: ${booking.id}\nMode: ${booking.deliveryMode}`
  );
  const gCalLocation = encodeURIComponent(
    booking.deliveryMode === "online" ? "Google Meet" : "Hope Counseling Clinic, Nairobi, Kenya"
  );
  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gCalTitle}&details=${gCalDetails}&location=${gCalLocation}`;

  return (
    <div className="space-y-8 text-center max-w-xl mx-auto">
      {/* Success Badge */}
      <div className="inline-flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-[#7ecab0] font-bold">
            Appointment Confirmed
          </span>
          <h3 className="font-playfair text-2xl sm:text-3xl text-[#0d2b22] mt-1">
            We look forward to meeting you.
          </h3>
        </div>
      </div>

      {/* Booking Reference Card */}
      <div className="bg-white rounded-2xl border border-black/[0.08] p-6 shadow-sm text-left space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#888] block">
              Booking Reference
            </span>
            <span className="font-mono text-lg font-bold text-[#0d2b22] tracking-wider">
              {booking.id}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            Status: Confirmed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[#888] font-sans flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7ecab0]" /> Date
            </span>
            <span className="font-sans font-semibold text-[#0d2b22] text-sm">{booking.date}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[#888] font-sans flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7ecab0]" /> Time
            </span>
            <span className="font-sans font-semibold text-[#0d2b22] text-sm">
              {booking.timeFormatted} (East Africa Time)
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[#888] font-sans">Client</span>
            <span className="font-sans font-semibold text-[#0d2b22] block">
              {booking.clientName}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[#888] font-sans">Delivery Mode</span>
            <span className="font-sans font-semibold text-[#0d2b22] capitalize block">
              {booking.deliveryMode === "online" ? "Online Video / Voice" : "In-Person Clinic"}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between text-xs">
          <span className="text-[#888] font-sans">Session Fee</span>
          <span className="font-sans font-bold text-sm text-[#0d2b22]">
            KSh {booking.price.toLocaleString()} ({booking.currency})
          </span>
        </div>
      </div>

      {/* Calendar Export Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {result.calendarIcsUrl && (
          <a
            href={result.calendarIcsUrl}
            download={`hope-counseling-${booking.id}.ics`}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0d2b22] text-[#7ecab0] hover:bg-[#1a4a38] font-sans text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Add to Calendar (.ics)
          </a>
        )}

        <a
          href={gCalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-black/10 text-[#0d2b22] hover:bg-black/5 font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Google Calendar
        </a>
      </div>

      {/* Manage Appointment Links (Cancel / Reschedule) */}
      <div className="p-4 rounded-xl bg-[#f9f7f4] border border-black/5 text-xs text-[#666] space-y-3">
        <p className="font-sans">
          A confirmation SMS has been dispatched to{" "}
          <strong className="text-[#0d2b22]">{booking.clientPhone}</strong>. Need to adjust your booking?
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-1 font-sans">
          {result.cancelUrl && (
            <a
              href={result.cancelUrl}
              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 underline font-medium"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel Appointment
            </a>
          )}

          {result.rescheduleUrl && (
            <a
              href={result.rescheduleUrl}
              className="inline-flex items-center gap-1.5 text-[#0d2b22] hover:text-[#1a4a38] underline font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reschedule Appointment
            </a>
          )}

          <a
            href="https://wa.me/254701279231"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 underline font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contact via WhatsApp
          </a>
        </div>
      </div>

      {/* Reset CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-sans text-[#888] hover:text-[#0d2b22] underline transition-colors"
        >
          Book Another Appointment
        </button>
      </div>
    </div>
  );
}
