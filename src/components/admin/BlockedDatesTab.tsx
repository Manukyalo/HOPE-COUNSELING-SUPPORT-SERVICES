"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { BlockedDate } from "@/types/booking";
import { fetchAvailabilitySettings, addBlockedDate, deleteBlockedDate } from "@/services/booking-service";

export default function BlockedDatesTab() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAvailabilitySettings();
    setBlockedDates(data.blockedDates);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      setMessage({ text: "Please provide a valid start date.", type: "error" });
      return;
    }
    const finalEnd = endDate || startDate;
    if (finalEnd < startDate) {
      setMessage({ text: "End date cannot be prior to start date.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const newBlocked = await addBlockedDate({
      startDate,
      endDate: finalEnd,
      reason: reason.trim() || "Counselor Leave / Unavailable",
      allDay,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
    });

    setSubmitting(false);

    if (newBlocked) {
      setBlockedDates((prev) => [newBlocked, ...prev]);
      setStartDate("");
      setEndDate("");
      setReason("");
      setMessage({ text: "Blocked date added to practice calendar.", type: "success" });
    } else {
      setMessage({ text: "Failed to block date. Please try again.", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteBlockedDate(id);
    if (success) {
      setBlockedDates((prev) => prev.filter((b) => b.id !== id));
      setMessage({ text: "Blocked period removed.", type: "success" });
    } else {
      setMessage({ text: "Could not remove blocked date.", type: "error" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-instrument text-2xl text-white">Blocked Dates & Holidays</h2>
        <p className="font-sans text-xs text-white/50 mt-0.5">
          Black out holidays, practitioner leave, or specific hours from public booking.
        </p>
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

      {/* Add New Blocked Period Form */}
      <form
        onSubmit={handleAddBlockedDate}
        className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-5 space-y-4 shadow-sm"
      >
        <h3 className="font-instrument text-lg text-white">Block New Date / Range</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#7ecab0] block mb-1">
              Start Date *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-10 bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-[#7ecab0]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#7ecab0] block mb-1">
              End Date (Optional single day)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-10 bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-[#7ecab0]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#7ecab0] block mb-1">
              Reason / Label
            </label>
            <input
              type="text"
              placeholder="e.g. Public Holiday, Annual Leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 bg-white/[0.04] border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-[#7ecab0] placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="accent-[#7ecab0] w-4 h-4 rounded"
            />
            <span className="text-xs text-white/80 font-sans">Block Entire Day(s)</span>
          </label>

          {!allDay && (
            <div className="flex items-center gap-2 text-xs text-white font-sans">
              <span className="text-white/40">From</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono"
              />
              <span className="text-white/40">to</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="ml-auto px-5 py-2.5 rounded-xl bg-[#7ecab0] hover:bg-[#9de4cd] text-[#071a14] font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Block Date</span>
          </button>
        </div>
      </form>

      {/* Blocked Dates List */}
      <div className="space-y-3">
        <h3 className="font-instrument text-lg text-white">Active Blocked Dates ({blockedDates.length})</h3>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#7ecab0] animate-spin" />
            <p className="text-xs text-white/40">Loading blocked calendar entries...</p>
          </div>
        ) : blockedDates.length === 0 ? (
          <div className="p-8 text-center bg-[#0a241c]/40 rounded-2xl border border-white/5">
            <Calendar className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-xs text-white/50">No dates are currently blocked.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {blockedDates.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#0a241c]/70 border border-white/10 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-semibold text-white">{b.reason}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {b.allDay ? "All Day" : `${b.startTime} - ${b.endTime}`}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 font-sans mt-0.5">
                    {b.startDate} {b.endDate !== b.startDate ? `through ${b.endDate}` : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(b.id!)}
                  title="Remove Block"
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-white/40 hover:text-red-300 border border-white/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
