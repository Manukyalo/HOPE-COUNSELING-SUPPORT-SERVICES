"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  date: string | null;
  time: string | null;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

// ─── Service category lookup ──────────────────────────────────────────────────

const SERVICE_LABELS: Record<string, string> = {
  individual: "Individual Counselling",
  online: "Online Counselling",
  student: "Student & Young Adult",
  couples: "Couples / Relationship",
  initial: "Initial Consultation",
  "student-pkg": "Student Wellness Package",
  "personal-pkg": "Personal Growth Package",
  "extended-pkg": "Extended Support Package",
};

const STATUS_COLORS: Record<Booking["status"], string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("hope_admin_bookings") || "[]");
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("hope_admin_bookings", JSON.stringify(bookings));
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Session stats ────────────────────────────────────────────────────────────

function computeStats(bookings: Booking[]) {
  const freq: Record<string, number> = {};
  bookings.forEach((b) => {
    const label = SERVICE_LABELS[b.serviceId] ?? b.serviceName;
    freq[label] = (freq[label] ?? 0) + 1;
  });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;

  return { freq: sorted, total, pending, confirmed, completed };
}

// ─── Notification Toast ───────────────────────────────────────────────────────

function NotificationBanner({ booking, onDismiss }: { booking: Booking; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-4 right-4 z-[999] max-w-sm w-full bg-[#0d2b22] text-white rounded-2xl p-5 shadow-2xl border border-[#7ecab0]/30 flex items-start gap-3"
    >
      <span className="text-2xl shrink-0">🔔</span>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#a8e6cf] mb-1">
          New Session Booked
        </p>
        <p className="font-instrument text-base text-white leading-snug truncate">
          {booking.clientName}
        </p>
        <p className="font-sans text-[11px] text-white/60 mt-0.5 truncate">
          {SERVICE_LABELS[booking.serviceId] ?? booking.serviceName}
        </p>
        {booking.date && (
          <p className="font-sans text-[11px] text-[#7ecab0] mt-0.5">
            {booking.date} · {booking.time}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-white/40 hover:text-white text-lg shrink-0 leading-none"
      >
        ×
      </button>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notification, setNotification] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState<"bookings" | "analytics">("bookings");

  // ── Auth ────────────────────────────────────────────────────────────────────
  const ADMIN_PIN = "2580"; // Simple PIN — change as needed

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // ── Live reload from localStorage ──────────────────────────────────────────
  const refresh = useCallback(() => {
    setBookings(loadBookings());
  }, []);

  useEffect(() => {
    refresh();
    const handleNew = (e: Event) => {
      const custom = e as CustomEvent<Booking>;
      setBookings(loadBookings());
      setNotification(custom.detail);
    };
    window.addEventListener("hope:new-booking", handleNew);
    const interval = setInterval(refresh, 15000); // poll every 15s as fallback
    return () => {
      window.removeEventListener("hope:new-booking", handleNew);
      clearInterval(interval);
    };
  }, [refresh]);

  // ── Derived data ───────────────────────────────────────────────────────────
  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchSearch =
      !search ||
      b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = computeStats(bookings);

  const updateStatus = (id: string, status: Booking["status"]) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    saveBookings(updated);
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    saveBookings(updated);
  };

  // ── Seed demo data if empty ─────────────────────────────────────────────────
  const seedDemo = () => {
    const demos: Booking[] = [
      { id: "BK-DEMO1", clientName: "Client A", email: "a@example.com", phone: "+254700000001", serviceId: "individual", serviceName: "Individual Counselling — KSh 1,000", date: "Tuesday, October 7, 2026", time: "Morning", status: "Pending", createdAt: new Date().toISOString() },
      { id: "BK-DEMO2", clientName: "Client B", email: "b@example.com", phone: "+254700000002", serviceId: "student", serviceName: "Student & Young Adult Support — KSh 700", date: "Wednesday, October 8, 2026", time: "Afternoon", status: "Confirmed", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: "BK-DEMO3", clientName: "Client C", email: "c@example.com", phone: "+254700000003", serviceId: "personal-pkg", serviceName: "Personal Growth Package — KSh 3,600", date: "Thursday, October 9, 2026", time: "Evening", status: "Completed", createdAt: new Date(Date.now() - 172800000).toISOString() },
      { id: "BK-DEMO4", clientName: "Client D", email: "d@example.com", phone: "+254700000004", serviceId: "couples", serviceName: "Couples / Relationship Counselling — KSh 1,500", date: "Friday, October 10, 2026", time: "Morning", status: "Pending", createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "BK-DEMO5", clientName: "Client E", email: "e@example.com", phone: "+254700000005", serviceId: "student-pkg", serviceName: "Student Wellness Package — KSh 2,500", date: "Monday, October 13, 2026", time: "Afternoon", status: "Pending", createdAt: new Date(Date.now() - 7200000).toISOString() },
    ];
    saveBookings(demos);
    setBookings(demos);
  };

  // ─── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0d2b22] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-10">
            <div className="text-4xl mb-4">🌸</div>
            <h1 className="font-instrument text-3xl text-white mb-2">Admin Dashboard</h1>
            <p className="font-sans text-xs text-white/50 uppercase tracking-widest">Hope Counseling Support Services</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5">
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-[#7ecab0] block mb-2">
                Admin PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter PIN"
                className={`w-full h-12 bg-white/10 border rounded-xl px-4 font-sans text-white text-base outline-none transition-all placeholder:text-white/20 ${
                  pinError ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-[#7ecab0]"
                }`}
              />
              {pinError && (
                <p className="font-sans text-xs text-red-400 mt-2">Incorrect PIN. Try again.</p>
              )}
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3.5 bg-[#7ecab0] hover:bg-[#a8e6cf] text-[#0d2b22] rounded-xl font-sans text-sm font-semibold tracking-wide transition-all"
            >
              Access Dashboard
            </button>
          </div>

          <p className="text-center font-sans text-[10px] text-white/20 mt-8 uppercase tracking-widest">
            Restricted Access · Hope Counseling Admin
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      {/* Live Notification */}
      <AnimatePresence>
        {notification && (
          <NotificationBanner
            booking={notification}
            onDismiss={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="bg-[#0d2b22] text-white px-6 py-5 flex items-center justify-between sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌸</span>
          <div>
            <h1 className="font-instrument text-xl leading-tight">Hope Counseling</h1>
            <p className="font-sans text-[10px] text-[#7ecab0] uppercase tracking-widest">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#7ecab0] animate-pulse" />
          <span className="font-sans text-[10px] text-white/50 uppercase tracking-wider hidden sm:block">Live</span>
          <button
            onClick={() => setAuthed(false)}
            className="ml-4 font-sans text-[10px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.total, icon: "📋", color: "bg-white" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "bg-amber-50" },
            { label: "Confirmed", value: stats.confirmed, icon: "✅", color: "bg-blue-50" },
            { label: "Completed", value: stats.completed, icon: "🎉", color: "bg-emerald-50" },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${s.color} rounded-2xl p-5 border border-black/[0.05] shadow-sm`}
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-instrument text-3xl text-[#0d2b22] leading-none mb-1">{s.value}</div>
              <div className="font-sans text-[10px] uppercase tracking-wider text-[#888]">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tab Nav */}
        <div className="flex gap-2 mb-6">
          {(["bookings", "analytics"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-5 py-2 rounded-full font-sans text-xs font-medium uppercase tracking-wider transition-all ${
                activeView === v
                  ? "bg-[#0d2b22] text-white shadow"
                  : "bg-white text-[#555] border border-black/[0.07] hover:bg-[#f0f0f0]"
              }`}
            >
              {v === "bookings" ? "📋 Sessions" : "📊 Analytics"}
            </button>
          ))}
          <button
            onClick={refresh}
            className="ml-auto px-4 py-2 rounded-full font-sans text-[10px] uppercase tracking-wider bg-white border border-black/[0.07] text-[#555] hover:bg-[#f0f0f0] transition-all"
          >
            ↻ Refresh
          </button>
        </div>

        {/* ── BOOKINGS VIEW ─────────────────────────────────────────────── */}
        {activeView === "bookings" && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Search by name, service, or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-10 px-4 rounded-xl border border-black/[0.08] bg-white font-sans text-sm outline-none focus:border-[#7ecab0] transition-all"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-4 pr-8 rounded-xl border border-black/[0.08] bg-white font-sans text-sm outline-none focus:border-[#7ecab0] transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Bookings list */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="font-instrument text-2xl text-[#0d2b22] mb-2">No sessions yet</h3>
                <p className="font-sans text-sm text-[#888] mb-6">Bookings made via WhatsApp will appear here.</p>
                <button
                  onClick={seedDemo}
                  className="px-6 py-2.5 bg-[#0d2b22] text-white rounded-full font-sans text-xs font-medium tracking-wider hover:bg-[#1a4a38] transition-all"
                >
                  Load Demo Data
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filtered.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-white rounded-2xl p-5 border border-black/[0.05] shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      {/* Left: info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-sans text-[10px] text-[#999] font-mono">{b.id}</span>
                          <span className={`font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[b.status]}`}>
                            {b.status}
                          </span>
                        </div>
                        <h3 className="font-instrument text-lg text-[#0d2b22] leading-tight truncate">{b.clientName}</h3>
                        <p className="font-sans text-xs text-[#7ecab0] font-medium truncate">
                          {SERVICE_LABELS[b.serviceId] ?? b.serviceName}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                          {b.date && (
                            <span className="font-sans text-[11px] text-[#666]">📅 {b.date} · {b.time}</span>
                          )}
                          {b.phone && (
                            <a
                              href={`https://wa.me/${b.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans text-[11px] text-green-700 hover:underline"
                            >
                              💬 {b.phone}
                            </a>
                          )}
                          <span className="font-sans text-[11px] text-[#aaa]">{formatDate(b.createdAt)}</span>
                        </div>
                      </div>

                      {/* Right: controls */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value as Booking["status"])}
                          className="h-8 px-2 pr-6 rounded-lg border border-black/[0.08] bg-[#f9f7f4] font-sans text-xs outline-none focus:border-[#7ecab0] transition-all"
                        >
                          <option>Pending</option>
                          <option>Confirmed</option>
                          <option>Completed</option>
                          <option>Cancelled</option>
                        </select>
                        <a
                          href={`https://wa.me/${b.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${b.clientName}, your session has been confirmed. Looking forward to seeing you.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 px-3 bg-[#e0f4ec] text-[#1e5c45] rounded-lg font-sans text-xs font-medium hover:bg-[#c8eadb] transition-all flex items-center gap-1"
                        >
                          💬 Confirm
                        </a>
                        <button
                          onClick={() => deleteBooking(b.id)}
                          className="h-8 px-3 bg-red-50 text-red-600 rounded-lg font-sans text-xs hover:bg-red-100 transition-all border border-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {/* ── ANALYTICS VIEW ────────────────────────────────────────────── */}
        {activeView === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-black/[0.05] shadow-sm">
              <h2 className="font-instrument text-2xl text-[#0d2b22] mb-2">Most Booked Sessions</h2>
              <p className="font-sans text-xs text-[#888] mb-8">Ranked by total bookings across all time.</p>

              {stats.freq.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="font-sans text-sm text-[#888]">No data yet. Bookings will appear here.</p>
                  <button onClick={seedDemo} className="mt-4 px-5 py-2 bg-[#0d2b22] text-white rounded-full font-sans text-xs font-medium hover:bg-[#1a4a38] transition-all">
                    Load Demo Data
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.freq.map(([label, count], i) => {
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-sans text-sm text-[#0d2b22] font-medium">{label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-instrument text-lg text-[#0d2b22]">{count}</span>
                            <span className="font-sans text-[11px] text-[#888]">{pct}%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{
                              background: i === 0
                                ? "#7ecab0"
                                : i === 1
                                ? "#a8e6cf"
                                : "#c8f2e0",
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["Pending", "Confirmed", "Completed", "Cancelled"] as const).map((s) => {
                const count = bookings.filter((b) => b.status === s).length;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={s} className="bg-white rounded-2xl p-5 border border-black/[0.05] shadow-sm">
                    <div className={`inline-block font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-3 ${STATUS_COLORS[s]}`}>
                      {s}
                    </div>
                    <div className="font-instrument text-4xl text-[#0d2b22]">{count}</div>
                    <div className="font-sans text-[11px] text-[#888] mt-1">{pct}% of total</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
