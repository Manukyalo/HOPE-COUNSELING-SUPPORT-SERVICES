"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import MonthGrid from "./booking/MonthGrid";
import TimeSlotPicker from "./booking/TimeSlotPicker";
import BookingDetailsStep from "./booking/BookingDetailsStep";
import BookingConfirmationStep from "./booking/BookingConfirmationStep";
import {
  DayAvailabilitySummary,
  PublicSlotSummary,
  BookingCreationResult,
  SessionType,
  DeliveryMode,
} from "@/types/booking";

export default function BookingFlow() {
  // Steps: 1 = Pick Date, 2 = Pick Time, 3 = Client Details, 4 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Month navigation (year and month for the primary visible month)
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);

  // Availability map from server
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, DayAvailabilitySummary>>({});
  const [calendarLoading, setCalendarLoading] = useState(true);

  // Selection states
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [daySlots, setDaySlots] = useState<PublicSlotSummary[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<PublicSlotSummary | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingCreationResult | null>(null);

  // Compute min and max bookable dates in EAT
  const { minDateStr, maxDateStr } = useMemo(() => {
    const now = new Date();
    // Min date: tomorrow in EAT
    const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
    const minStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(tomorrow);

    // Max date: 60 days ahead
    const maxDate = new Date(now.getTime() + 60 * 24 * 3600 * 1000);
    const maxStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(maxDate);

    return { minDateStr: minStr, maxDateStr: maxStr };
  }, []);

  // Compute second month for desktop two-month view
  const nextMonthObj = useMemo(() => {
    if (currentMonth === 12) {
      return { year: currentYear + 1, month: 1 };
    }
    return { year: currentYear, month: currentMonth + 1 };
  }, [currentYear, currentMonth]);

  // Fetch month availability from server route
  const fetchMonthAvailability = useCallback(async (year: number, month: number) => {
    setCalendarLoading(true);
    try {
      const monthStr1 = `${year}-${String(month).padStart(2, "0")}`;
      const nextM = month === 12 ? 1 : month + 1;
      const nextY = month === 12 ? year + 1 : year;
      const monthStr2 = `${nextY}-${String(nextM).padStart(2, "0")}`;

      const [res1, res2] = await Promise.all([
        fetch(`/api/booking/availability?month=${monthStr1}`),
        fetch(`/api/booking/availability?month=${monthStr2}`),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();

      setAvailabilityMap((prev) => ({
        ...prev,
        ...(data1.availability || {}),
        ...(data2.availability || {}),
      }));
    } catch (e) {
      console.error("[BookingFlow] Error fetching availability:", e);
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthAvailability(currentYear, currentMonth);
  }, [currentYear, currentMonth, fetchMonthAvailability]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    const today = new Date();
    // Prevent navigating to past months
    if (currentYear === today.getFullYear() && currentMonth <= today.getMonth() + 1) {
      return;
    }
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Date selection handler
  const handleSelectDate = async (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setSelectedSlot(null);
    setBookingError(null);
    setSlotsLoading(true);
    setStep(2);

    try {
      const res = await fetch(`/api/booking/availability?date=${dateStr}`);
      const data = await res.json();
      if (res.ok && data.slots) {
        setDaySlots(data.slots);
      } else {
        setDaySlots([]);
      }
    } catch {
      setDaySlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  // Slot selection handler
  const handleSelectSlot = (slot: PublicSlotSummary) => {
    setSelectedSlot(slot);
    setBookingError(null);
  };

  // Final booking submission handler
  const handleBookingSubmit = async (formData: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    sessionType: SessionType;
    deliveryMode: DeliveryMode;
    notes?: string;
    website_hp?: string;
  }) => {
    if (!selectedSlot || !selectedDateStr) return;

    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.slotId,
          startUtc: selectedSlot.startUtc,
          ...formData,
        }),
      });

      const data: BookingCreationResult = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === "SLOT_CONFLICT") {
          setBookingError("That slot was just taken by another client, please pick another available time.");
          // Refresh slots for this date
          handleSelectDate(selectedDateStr);
          setStep(2);
        } else {
          setBookingError(data.error || "Booking could not be confirmed. Please try again.");
        }
      } else {
        setBookingResult(data);
        setStep(4);
      }
    } catch {
      setBookingError("A network error occurred. Please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset entire flow
  const handleReset = () => {
    setStep(1);
    setSelectedDateStr(null);
    setSelectedSlot(null);
    setBookingError(null);
    setBookingResult(null);
    fetchMonthAvailability(currentYear, currentMonth);
  };

  return (
    <section id="book" className="py-20 md:py-32 bg-[#f9f7f4] relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#7ecab0] font-bold">
            Online Booking System
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl text-[#0d2b22] mt-2 mb-3">
            Schedule Your Session
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#666] max-w-md mx-auto">
            Book a confidential appointment in East Africa Time. Initial consultation is only KSh 300.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 mb-10 sm:mb-14 relative">
          <div className="absolute h-[1px] bg-black/[0.08] w-48 sm:w-80 z-0" />
          {[
            { num: 1, label: "Date" },
            { num: 2, label: "Time" },
            { num: 3, label: "Details" },
            { num: 4, label: "Confirmed" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-semibold transition-all duration-300 ${
                  step === s.num
                    ? "border-2 border-[#7ecab0] text-[#0d2b22] bg-white ring-4 ring-[#7ecab0]/20"
                    : step > s.num
                    ? "bg-[#0d2b22] text-[#7ecab0]"
                    : "bg-white text-[#bbb] border border-black/[0.08]"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span
                className={`text-[10px] font-sans uppercase tracking-wider hidden sm:block ${
                  step === s.num ? "font-bold text-[#0d2b22]" : "text-[#888]"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Content Box */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* ─── STEP 1: PICK A DATE ────────────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h3 className="font-playfair text-xl sm:text-2xl text-[#0d2b22]">
                    Select a Date
                  </h3>
                  <p className="font-sans text-xs text-[#777]">
                    Appointments can be booked from tomorrow up to 60 days in advance.
                  </p>
                </div>

                {calendarLoading && Object.keys(availabilityMap).length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
                    <Loader2 className="w-8 h-8 text-[#7ecab0] animate-spin" />
                    <p className="font-sans text-xs text-[#888]">Loading calendar availability...</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop: Two Months Side-by-Side */}
                    <div className="hidden md:grid md:grid-cols-2 gap-6">
                      <MonthGrid
                        year={currentYear}
                        month={currentMonth}
                        selectedDate={selectedDateStr}
                        availabilityMap={availabilityMap}
                        onSelectDate={handleSelectDate}
                        onPrevMonth={handlePrevMonth}
                        showPrevNav={true}
                        showNextNav={false}
                        minDateStr={minDateStr}
                        maxDateStr={maxDateStr}
                      />
                      <MonthGrid
                        year={nextMonthObj.year}
                        month={nextMonthObj.month}
                        selectedDate={selectedDateStr}
                        availabilityMap={availabilityMap}
                        onSelectDate={handleSelectDate}
                        onNextMonth={handleNextMonth}
                        showPrevNav={false}
                        showNextNav={true}
                        minDateStr={minDateStr}
                        maxDateStr={maxDateStr}
                      />
                    </div>

                    {/* Mobile: Single Month Swipeable Grid */}
                    <div className="block md:hidden">
                      <MonthGrid
                        year={currentYear}
                        month={currentMonth}
                        selectedDate={selectedDateStr}
                        availabilityMap={availabilityMap}
                        onSelectDate={handleSelectDate}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                        showPrevNav={true}
                        showNextNav={true}
                        minDateStr={minDateStr}
                        maxDateStr={maxDateStr}
                      />
                    </div>

                    {/* Calendar Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-[11px] font-sans text-[#666]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Few Slots Left</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs line-through text-[#aaa] font-semibold">15</span>
                        <span>Fully Booked / Closed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-md bg-[#0d2b22] ring-1 ring-[#7ecab0]" />
                        <span>Selected</span>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ─── STEP 2: PICK A TIME ────────────────────────────────────────── */}
            {step === 2 && selectedDateStr && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <TimeSlotPicker
                  dateStr={selectedDateStr}
                  slots={daySlots}
                  selectedSlotId={selectedSlot?.slotId || null}
                  onSelectSlot={handleSelectSlot}
                  loading={slotsLoading}
                  onBack={() => setStep(1)}
                  onContinue={() => setStep(3)}
                />
              </motion.div>
            )}

            {/* ─── STEP 3: DETAILS & CONFIRM PREVIEW ─────────────────────────── */}
            {step === 3 && selectedDateStr && selectedSlot && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <BookingDetailsStep
                  selectedDateStr={selectedDateStr}
                  selectedSlot={selectedSlot}
                  onBack={() => setStep(2)}
                  onSubmit={handleBookingSubmit}
                  submitting={submitting}
                  errorMessage={bookingError}
                />
              </motion.div>
            )}

            {/* ─── STEP 4: CONFIRMATION SUCCESS ─────────────────────────────── */}
            {step === 4 && bookingResult && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BookingConfirmationStep result={bookingResult} onReset={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
