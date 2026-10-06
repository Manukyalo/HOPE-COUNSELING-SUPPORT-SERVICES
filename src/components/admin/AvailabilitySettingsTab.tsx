"use client";

import React, { useState, useEffect } from "react";
import { Clock, Save, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { AvailabilityRules, DaySchedule } from "@/types/booking";
import { fetchAvailabilitySettings, saveAvailabilityRules } from "@/services/booking-service";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AvailabilitySettingsTab() {
  const [rules, setRules] = useState<AvailabilityRules | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAvailabilitySettings();
      if (data.rules) {
        setRules(data.rules);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleDayToggle = (dayIdx: number) => {
    if (!rules) return;
    const current = rules.weeklySchedule[dayIdx] || {
      enabled: false,
      start: "09:00",
      end: "17:00",
    };
    setRules({
      ...rules,
      weeklySchedule: {
        ...rules.weeklySchedule,
        [dayIdx]: { ...current, enabled: !current.enabled },
      },
    });
  };

  const handleDayTimeChange = (
    dayIdx: number,
    field: keyof DaySchedule,
    val: string
  ) => {
    if (!rules) return;
    const current = rules.weeklySchedule[dayIdx];
    if (!current) return;
    setRules({
      ...rules,
      weeklySchedule: {
        ...rules.weeklySchedule,
        [dayIdx]: { ...current, [field]: val },
      },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rules) return;
    setSaving(true);
    setMessage(null);

    const success = await saveAvailabilityRules(rules);
    setSaving(false);
    if (success) {
      setMessage({ text: "Weekly schedule & booking rules saved successfully.", type: "success" });
    } else {
      setMessage({ text: "Failed to save settings. Please try again.", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#7ecab0] animate-spin" />
        <p className="font-sans text-xs text-white/50">Loading practice schedule...</p>
      </div>
    );
  }

  if (!rules) {
    return (
      <div className="p-8 text-center bg-[#0a241c]/50 rounded-2xl border border-white/10">
        <p className="text-white/60 text-xs">Could not load schedule rules.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="font-instrument text-2xl text-white">Practice Schedule & Rules</h2>
          <p className="font-sans text-xs text-white/50 mt-0.5">
            Configure weekly clinic hours, session buffers, and booking window in East Africa Time (EAT).
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#7ecab0] hover:bg-[#9de4cd] text-[#071a14] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Schedule
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="font-sans text-xs">{message.text}</span>
        </div>
      )}

      {/* Global Session Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-4">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#7ecab0] block mb-1">
            Session Duration
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={15}
              max={180}
              step={5}
              value={rules.sessionDurationMinutes}
              onChange={(e) =>
                setRules({ ...rules, sessionDurationMinutes: Number(e.target.value) })
              }
              className="w-20 h-10 bg-white/[0.04] border border-white/10 rounded-xl px-3 text-sm text-white font-mono focus:border-[#7ecab0] outline-none"
            />
            <span className="text-xs text-white/50 font-sans">minutes</span>
          </div>
        </div>

        <div className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-4">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#7ecab0] block mb-1">
            Buffer Between Sessions
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={60}
              step={5}
              value={rules.bufferMinutes}
              onChange={(e) =>
                setRules({ ...rules, bufferMinutes: Number(e.target.value) })
              }
              className="w-20 h-10 bg-white/[0.04] border border-white/10 rounded-xl px-3 text-sm text-white font-mono focus:border-[#7ecab0] outline-none"
            />
            <span className="text-xs text-white/50 font-sans">minutes</span>
          </div>
        </div>

        <div className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-4">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#7ecab0] block mb-1">
            Min Advance Notice
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={72}
              value={rules.minAdvanceHours}
              onChange={(e) =>
                setRules({ ...rules, minAdvanceHours: Number(e.target.value) })
              }
              className="w-20 h-10 bg-white/[0.04] border border-white/10 rounded-xl px-3 text-sm text-white font-mono focus:border-[#7ecab0] outline-none"
            />
            <span className="text-xs text-white/50 font-sans">hours (e.g. 12h = next day)</span>
          </div>
        </div>

        <div className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-4">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#7ecab0] block mb-1">
            Booking Window
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={7}
              max={180}
              value={rules.bookingWindowDays}
              onChange={(e) =>
                setRules({ ...rules, bookingWindowDays: Number(e.target.value) })
              }
              className="w-20 h-10 bg-white/[0.04] border border-white/10 rounded-xl px-3 text-sm text-white font-mono focus:border-[#7ecab0] outline-none"
            />
            <span className="text-xs text-white/50 font-sans">days ahead</span>
          </div>
        </div>
      </div>

      {/* Weekly Working Days Schedule */}
      <div className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="font-instrument text-lg text-white">Weekly Working Days (EAT)</h3>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
            const dayName = DAY_NAMES[dayIdx];
            const schedule = rules.weeklySchedule[dayIdx] || {
              enabled: false,
              start: "09:00",
              end: "17:00",
            };

            return (
              <div
                key={dayIdx}
                className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  schedule.enabled
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-white/[0.01] border-white/5 opacity-60"
                }`}
              >
                {/* Day toggle */}
                <div className="flex items-center gap-3 w-36">
                  <input
                    type="checkbox"
                    checked={schedule.enabled}
                    onChange={() => handleDayToggle(dayIdx)}
                    className="accent-[#7ecab0] w-4 h-4 rounded cursor-pointer"
                  />
                  <span
                    className={`font-sans text-xs font-semibold ${
                      schedule.enabled ? "text-white" : "text-white/40"
                    }`}
                  >
                    {dayName}
                  </span>
                </div>

                {/* Hours Controls */}
                {schedule.enabled ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40">From</span>
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => handleDayTimeChange(dayIdx, "start", e.target.value)}
                        className="bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1 text-white text-xs font-mono outline-none focus:border-[#7ecab0]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40">To</span>
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => handleDayTimeChange(dayIdx, "end", e.target.value)}
                        className="bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1 text-white text-xs font-mono outline-none focus:border-[#7ecab0]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                      <span className="text-white/40">Break:</span>
                      <input
                        type="time"
                        value={schedule.breakStart || "13:00"}
                        onChange={(e) => handleDayTimeChange(dayIdx, "breakStart", e.target.value)}
                        className="bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1 text-white text-xs font-mono outline-none focus:border-[#7ecab0]"
                      />
                      <span className="text-white/40">-</span>
                      <input
                        type="time"
                        value={schedule.breakEnd || "14:00"}
                        onChange={(e) => handleDayTimeChange(dayIdx, "breakEnd", e.target.value)}
                        className="bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1 text-white text-xs font-mono outline-none focus:border-[#7ecab0]"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-white/40 font-sans italic">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );
}
