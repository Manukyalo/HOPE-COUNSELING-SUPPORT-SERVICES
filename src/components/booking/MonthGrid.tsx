"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayAvailabilitySummary } from "@/types/booking";

interface MonthGridProps {
  year: number;
  month: number; // 1-12
  selectedDate: string | null; // "YYYY-MM-DD"
  availabilityMap: Record<string, DayAvailabilitySummary>;
  onSelectDate: (dateStr: string) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  showPrevNav?: boolean;
  showNextNav?: boolean;
  minDateStr: string;
  maxDateStr: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthGrid({
  year,
  month,
  selectedDate,
  availabilityMap,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  showPrevNav = true,
  showNextNav = true,
  minDateStr,
  maxDateStr,
}: MonthGridProps) {
  const monthName = new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Calculate days in month & padding for first day of week
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate();

  const days: { dateStr: string; dayNum: number; isPadding: boolean }[] = [];

  // Padding days before start of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ dateStr: "", dayNum: 0, isPadding: true });
  }

  // Days in current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    days.push({ dateStr, dayNum: day, isPadding: false });
  }

  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-4 sm:p-5 shadow-sm">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/[0.04]">
        <div className="font-playfair text-base sm:text-lg font-semibold text-[#0d2b22]">
          {monthName}
        </div>
        <div className="flex items-center gap-1">
          {showPrevNav && onPrevMonth && (
            <button
              onClick={onPrevMonth}
              type="button"
              aria-label="Previous Month"
              className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#0d2b22] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7ecab0]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {showNextNav && onNextMonth && (
            <button
              onClick={onNextMonth}
              type="button"
              aria-label="Next Month"
              className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#0d2b22] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7ecab0]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {WEEKDAYS.map((wd) => (
          <span
            key={wd}
            className="text-[11px] font-sans font-medium text-[#999] uppercase tracking-wider py-1"
          >
            {wd}
          </span>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((item, idx) => {
          if (item.isPadding) {
            return <div key={`pad-${idx}`} className="h-12 sm:h-14" aria-hidden="true" />;
          }

          const { dateStr, dayNum } = item;
          const dayInfo = availabilityMap[dateStr];
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;

          const isPastOrOutOfWindow = dateStr < minDateStr || dateStr > maxDateStr;
          const isUnavailable =
            isPastOrOutOfWindow ||
            !dayInfo ||
            dayInfo.status === "unavailable" ||
            dayInfo.status === "fully_booked";

          const availableSlots = dayInfo?.availableSlotsCount || 0;
          const isLimited = dayInfo?.status === "limited";

          let ariaLabel = `${monthName} ${dayNum}`;
          if (isUnavailable) {
            ariaLabel += " - Fully booked or unavailable";
          } else {
            ariaLabel += ` - ${availableSlots} slots available`;
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isUnavailable}
              onClick={() => onSelectDate(dateStr)}
              aria-label={ariaLabel}
              aria-pressed={isSelected}
              className={`relative h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center p-1 transition-all group ${
                isSelected
                  ? "bg-[#0d2b22] text-[#7ecab0] shadow-md shadow-[#0d2b22]/20 ring-2 ring-[#7ecab0]"
                  : isUnavailable
                  ? "text-[#ccc] bg-black/[0.01] cursor-not-allowed opacity-50"
                  : "text-[#0d2b22] bg-[#fdfbf7] hover:bg-[#7ecab0]/15 hover:border-[#7ecab0]/40 border border-black/[0.04]"
              } ${isToday && !isSelected ? "ring-1 ring-inset ring-[#0d2b22]/30 font-semibold" : ""}`}
            >
              <span
                className={`text-xs sm:text-sm font-sans ${
                  isSelected ? "font-bold text-white" : isUnavailable ? "line-through" : "font-medium"
                }`}
              >
                {dayNum}
              </span>

              {/* Status slot badge / indicator */}
              {!isUnavailable && (
                <div className="mt-0.5 flex items-center justify-center">
                  {isSelected ? (
                    <span className="text-[9px] font-sans font-medium text-[#7ecab0] leading-none">
                      {availableSlots} slots
                    </span>
                  ) : isLimited ? (
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[9px] font-sans text-amber-700 hidden sm:inline leading-none">
                        {availableSlots} left
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-sans text-[#0d2b22]/70 hidden sm:inline leading-none">
                        {availableSlots}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {isUnavailable && isPastOrOutOfWindow && (
                <span className="text-[8px] text-[#bbb] font-sans leading-none mt-0.5 sm:hidden">
                  —
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
