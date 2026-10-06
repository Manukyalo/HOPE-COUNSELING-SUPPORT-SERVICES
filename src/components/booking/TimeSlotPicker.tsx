"use client";

import React from "react";
import { Clock, Globe, AlertCircle, Loader2 } from "lucide-react";
import { PublicSlotSummary } from "@/types/booking";

interface TimeSlotPickerProps {
  dateStr: string;
  slots: PublicSlotSummary[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: PublicSlotSummary) => void;
  loading: boolean;
  onBack: () => void;
  onContinue: () => void;
}

export default function TimeSlotPicker({
  dateStr,
  slots,
  selectedSlotId,
  onSelectSlot,
  loading,
  onBack,
  onContinue,
}: TimeSlotPickerProps) {
  // Format the date label nicely
  const [year, month, day] = dateStr.split("-").map(Number);
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const availableSlots = slots.filter((s) => s.isAvailable);

  return (
    <div className="space-y-6">
      {/* Date Header & Timezone Indicator */}
      <div className="text-center space-y-2">
        <h3 className="font-playfair text-xl sm:text-2xl text-[#0d2b22]">
          Available Times for {formattedDate}
        </h3>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d2b22]/5 text-[#0d2b22] text-xs font-sans font-medium">
          <Globe className="w-3.5 h-3.5 text-[#7ecab0]" />
          <span>Times shown in East Africa Time (EAT · UTC+3)</span>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#7ecab0] animate-spin" />
          <p className="font-sans text-xs text-[#888]">Fetching open appointment slots...</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="py-10 text-center bg-white rounded-2xl border border-black/5 p-6">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h4 className="font-sans text-sm font-semibold text-[#0d2b22]">No Open Slots On This Date</h4>
          <p className="font-sans text-xs text-[#666] mt-1 max-w-sm mx-auto">
            All appointments for this date are fully reserved or outside our operating hours.
            Please choose another date on the calendar.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-full bg-[#0d2b22] text-[#7ecab0]"
          >
            Choose Another Date
          </button>
        </div>
      ) : (
        <div>
          {/* Time Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            {slots.map((slot) => {
              const isSelected = selectedSlotId === slot.slotId;
              const isTaken = !slot.isAvailable;

              return (
                <button
                  key={slot.slotId}
                  type="button"
                  disabled={isTaken}
                  onClick={() => onSelectSlot(slot)}
                  aria-pressed={isSelected}
                  className={`h-14 rounded-xl flex items-center justify-center gap-2 font-sans transition-all text-sm font-medium border ${
                    isSelected
                      ? "bg-[#0d2b22] text-[#7ecab0] border-[#7ecab0] shadow-md shadow-[#0d2b22]/20 ring-2 ring-[#7ecab0]"
                      : isTaken
                      ? "bg-black/[0.03] text-[#bbb] border-transparent cursor-not-allowed line-through opacity-60"
                      : "bg-white text-[#0d2b22] border-black/[0.08] hover:border-[#7ecab0] hover:bg-[#7ecab0]/5"
                  }`}
                >
                  <Clock className={`w-4 h-4 ${isSelected ? "text-[#7ecab0]" : isTaken ? "text-[#ccc]" : "text-[#888]"}`} />
                  <span>{slot.timeFormatted}</span>
                  {isTaken && <span className="text-[10px] text-[#999] ml-1">(Taken)</span>}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[#888] font-sans px-1">
            <span>
              {availableSlots.length} slot{availableSlots.length === 1 ? "" : "s"} open
            </span>
            <span>Duration: 50–60 minutes</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-black/5">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-full border border-black/10 text-[#0d2b22] hover:bg-black/5 font-sans text-xs uppercase tracking-wider font-medium transition-colors"
        >
          Change Date
        </button>

        <button
          type="button"
          disabled={!selectedSlotId || loading}
          onClick={onContinue}
          className="px-8 py-3 rounded-full bg-[#0d2b22] text-[#7ecab0] hover:bg-[#1a4a38] disabled:opacity-30 disabled:cursor-not-allowed font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md shadow-[#0d2b22]/10"
        >
          Continue to Details
        </button>
      </div>
    </div>
  );
}
