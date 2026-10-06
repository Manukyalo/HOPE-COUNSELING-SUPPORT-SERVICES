"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  sendBookingNotification,
  requestNotificationPermission,
  isNotificationGranted,
} from "@/lib/pwa-notifications";

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

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
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
    const t = setTimeout(onDismiss, 9000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-4 right-4 z-[999] max-w-sm w-full bg-[#0d2b22] text-white rounded-2xl p-5 shadow-2xl border border-[#7ecab0]/40 flex items-start gap-3 backdrop-blur-md"
    >
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
        <span className="text-xl">🔔</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-[#7ecab0] animate-ping" />
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#a8e6cf]">
            New Booking Received
          </p>
        </div>
        <p className="font-instrument text-lg text-white leading-snug truncate">
          {booking.clientName}
        </p>
        <p className="font-sans text-xs text-[#7ecab0] font-medium truncate mt-0.5">
          {SERVICE_LABELS[booking.serviceId] ?? booking.serviceName}
        </p>
        {booking.date && (
          <p className="font-sans text-[11px] text-white/80 mt-1">
            📅 {booking.date} · {booking.time || "Morning"}
          </p>
        )}
        <div className="font-sans text-[11px] text-white/60 mt-0.5 flex flex-wrap gap-2">
          {booking.phone && <span>📞 {booking.phone}</span>}
          {booking.email && <span>✉️ {booking.email}</span>}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-white/40 hover:text-white text-lg shrink-0 leading-none p-1"
        aria-label="Dismiss notification"
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
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const ADMIN_PIN = "2580";

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // ── Notification Permission Check ──────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    }
    if (typeof window !== "undefined") {
      const isApp =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isApp);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    setNotifPermission(res);
    if (res === "granted") {
      // Fire confirmation test notification
      sendBookingNotification({
        id: "TEST-INIT",
        clientName: "System Test (Admin)",
        email: "counselor@hopecounseling.ke",
        phone: "+254701279231",
        serviceId: "individual",
        serviceName: "Individual Counselling — KSh 1,000",
        date: "Today",
        time: "Now",
      });
    }
  };

  const handleTestNotification = () => {
    const sampleBooking: Booking = {
      id: "BK-TEST-" + Math.floor(Math.random() * 900 + 100),
      clientName: "Grace Wanjiku",
      email: "wanjiku.grace@gmail.com",
      phone: "+254712345678",
      serviceId: "individual",
      serviceName: "Individual Counselling — KSh 1,000",
      date: "Thursday, October 8, 2026",
      time: "Morning (10:00 AM)",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setNotification(sampleBooking);
    sendBookingNotification(sampleBooking);
  };

  // ── Install prompt listener ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsStandalone(true);
      setInstallPrompt(null);
    }
  };

  // ── Live reload & Cross-Window Listeners ────────────────────────────────────
  const refresh = useCallback(() => {
    setBookings(loadBookings());
  }, []);

  useEffect(() => {
    refresh();

    // 1. Custom in-page event
    const handleNew = (e: Event) => {
      const custom = e as CustomEvent<Booking>;
      if (custom.detail) {
        setBookings(loadBookings());
        setNotification(custom.detail);
        sendBookingNotification(custom.detail);
      }
    };
    window.addEventListener("hope:new-booking", handleNew);

    // 2. Storage event (fires when booking is made in other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hope_admin_bookings") {
        setBookings(loadBookings());
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. BroadcastChannel (cross-tab real-time event)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("hope_admin_channel");
      channel.onmessage = (event) => {
        if (event.data?.type === "NEW_BOOKING" && event.data.booking) {
          setBookings(loadBookings());
          setNotification(event.data.booking);
          sendBookingNotification(event.data.booking);
        }
      };
    }

    const interval = setInterval(refresh, 12000);
    return () => {
      window.removeEventListener("hope:new-booking", handleNew);
      window.removeEventListener("storage", handleStorage);
      if (channel) channel.close();
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
      (b.phone && b.phone.includes(search)) ||
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

  // ── Demo data ──────────────────────────────────────────────────────────────
  const seedDemo = () => {
    const demos: Booking[] = [
      { id: "BK-842A", clientName: "Amina Mwangi", email: "amina.m@gmail.com", phone: "+254712345678", serviceId: "individual", serviceName: "Individual Counselling — KSh 1,000", date: "Wednesday, October 8, 2026", time: "Morning (10:00 AM)", status: "Pending", createdAt: new Date().toISOString() },
      { id: "BK-319B", clientName: "Brian Omondi", email: "b.omondi@ku.ac.ke", phone: "+254723456789", serviceId: "student", serviceName: "Student & Young Adult Support — KSh 700", date: "Thursday, October 9, 2026", time: "Afternoon (2:00 PM)", status: "Confirmed", createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "BK-902C", clientName: "Esther & David", email: "esther.k@gmail.com", phone: "+254734567890", serviceId: "couples", serviceName: "Couples / Relationship Counselling — KSh 1,500", date: "Friday, October 10, 2026", time: "Evening (5:00 PM)", status: "Pending", createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: "BK-551D", clientName: "Faith Chebet", email: "chebetf@gmail.com", phone: "+254745678901", serviceId: "personal-pkg", serviceName: "Personal Growth Package — KSh 3,600", date: "Monday, October 13, 2026", time: "Morning (11:00 AM)", status: "Completed", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: "BK-114E", clientName: "Kevin Ndung'u", email: "kndungu@uonbi.ac.ke", phone: "+254756789012", serviceId: "student-pkg", serviceName: "Student Wellness Package — KSh 2,500", date: "Tuesday, October 14, 2026", time: "Afternoon (3:00 PM)", status: "Pending", createdAt: new Date(Date.now() - 172800000).toISOString() },
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="/icons/icon-192.png"
                alt="Hope Counseling Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-instrument text-3xl text-white mb-2">Admin Dashboard</h1>
            <p className="font-sans text-xs text-white/50 uppercase tracking-widest">
              Hope Counseling Support Services
            </p>
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
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter PIN (Default: 2580)"
                className={`w-full h-12 bg-white/10 border rounded-xl px-4 font-sans text-white text-base outline-none transition-all placeholder:text-white/20 ${
                  pinError
                    ? "border-red-400 focus:border-red-400"
                    : "border-white/10 focus:border-[#7ecab0]"
                }`}
              />
              {pinError && (
                <p className="font-sans text-xs text-red-400 mt-2">Incorrect PIN. Try again.</p>
              )}
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3.5 bg-[#7ecab0] hover:bg-[#a8e6cf] text-[#0d2b22] rounded-xl font-sans text-sm font-semibold tracking-wide transition-all shadow-lg shadow-[#7ecab0]/20"
            >
              Access Dashboard
            </button>
          </div>

          <p className="text-center font-sans text-[10px] text-white/30 mt-8 uppercase tracking-widest">
            Restricted Counselor Access · Nairobi, Kenya
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      {/* Live Floating Notification */}
      <AnimatePresence>
        {notification && (
          <NotificationBanner
            booking={notification}
            onDismiss={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="bg-[#0d2b22] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src="/icons/icon-192.png"
            alt="Logo"
            className="w-9 h-9 rounded-xl object-cover border border-white/20 shadow-sm"
          />
          <div>
            <h1 className="font-instrument text-xl leading-tight text-white">Hope Counseling</h1>
            <p className="font-sans text-[10px] text-[#7ecab0] uppercase tracking-widest">
              Admin & Session Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {installPrompt && !isStandalone && (
            <button
              onClick={handleInstallApp}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7ecab0] text-[#0d2b22] font-sans text-xs font-semibold hover:bg-[#a8e6cf] transition-all shadow"
            >
              📲 Download App
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#7ecab0] animate-pulse" />
            <span className="font-sans text-[10px] text-white/70 uppercase tracking-wider hidden sm:block">
              Live
            </span>
          </div>

          <button
            onClick={() => setAuthed(false)}
            className="ml-2 font-sans text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Notification & Device Status Alert Bar ── */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              notifPermission === "granted" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              <span className="text-xl">{notifPermission === "granted" ? "🔔" : "🔕"}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-sans text-xs font-bold text-[#0d2b22] uppercase tracking-wide">
                  Device Notifications:
                </p>
                <span className={`font-sans text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                  notifPermission === "granted"
                    ? "bg-emerald-100 text-emerald-800"
                    : notifPermission === "denied"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {notifPermission === "granted" ? "Active (Ready)" : notifPermission === "denied" ? "Blocked in Browser" : "Permission Needed"}
                </span>
              </div>
              <p className="font-sans text-xs text-[#666] mt-0.5">
                {notifPermission === "granted"
                  ? "Your phone/device will receive instant alerts with client name, phone number, and scheduled session date."
                  : "Click 'Enable Notifications' to receive instant alerts when a client reserves a session."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {notifPermission !== "granted" ? (
              <button
                onClick={handleEnableNotifications}
                className="px-4 py-2 bg-[#0d2b22] text-white hover:bg-[#1a4a38] rounded-xl font-sans text-xs font-medium tracking-wide transition-all shadow"
              >
                🔔 Enable Device Notifications
              </button>
            ) : (
              <button
                onClick={handleTestNotification}
                className="px-3.5 py-2 bg-[#f0f9f5] border border-[#7ecab0]/40 text-[#1e5c45] hover:bg-[#e0f4ec] rounded-xl font-sans text-xs font-medium tracking-wide transition-all"
              >
                ⚡ Send Test Alert
              </button>
            )}

            {installPrompt && !isStandalone && (
              <button
                onClick={handleInstallApp}
                className="px-3.5 py-2 bg-[#7ecab0] text-[#0d2b22] hover:bg-[#a8e6cf] rounded-xl font-sans text-xs font-semibold tracking-wide transition-all shadow-sm"
              >
                📲 Download PWA
              </button>
            )}
          </div>
        </div>

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
              <div className="font-instrument text-3xl text-[#0d2b22] leading-none mb-1">
                {s.value}
              </div>
              <div className="font-sans text-[10px] uppercase tracking-wider text-[#888]">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {(["bookings", "analytics"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all ${
                activeView === v
                  ? "bg-[#0d2b22] text-white shadow-md"
                  : "bg-white text-[#555] border border-black/[0.07] hover:bg-[#f0f0f0]"
              }`}
            >
              {v === "bookings" ? "📋 Booked Sessions" : "📊 Most Frequent Sessions"}
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
                placeholder="Search by client name, phone, or service…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl border border-black/[0.08] bg-white font-sans text-sm outline-none focus:border-[#7ecab0] transition-all shadow-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-4 pr-8 rounded-xl border border-black/[0.08] bg-white font-sans text-sm outline-none focus:border-[#7ecab0] transition-all shadow-sm"
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
              <div className="text-center py-20 bg-white rounded-3xl border border-black/[0.05] p-8 shadow-sm">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="font-instrument text-2xl text-[#0d2b22] mb-2">
                  No sessions recorded yet
                </h3>
                <p className="font-sans text-sm text-[#888] mb-6 max-w-sm mx-auto">
                  When clients reserve a session, their details and time slot will appear here and notify you immediately.
                </p>
                <button
                  onClick={seedDemo}
                  className="px-6 py-2.5 bg-[#0d2b22] text-white rounded-full font-sans text-xs font-semibold tracking-wider hover:bg-[#1a4a38] transition-all shadow-md"
                >
                  Load Sample Client Bookings
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <AnimatePresence>
                  {filtered.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-white rounded-2xl p-5 border border-black/[0.05] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                    >
                      {/* Left: Client & session info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-sans text-[10px] text-[#999] font-mono tracking-wider">
                            {b.id}
                          </span>
                          <span
                            className={`font-sans text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              STATUS_COLORS[b.status]
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <h3 className="font-instrument text-xl text-[#0d2b22] leading-tight">
                          {b.clientName}
                        </h3>
                        <p className="font-sans text-xs text-[#1e5c45] font-semibold mt-0.5">
                          {SERVICE_LABELS[b.serviceId] ?? b.serviceName}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
                          {b.date && (
                            <span className="font-sans font-medium text-[#0d2b22] bg-[#f5f5f5] px-2.5 py-1 rounded-md">
                              📅 {b.date} · {b.time || "Morning"}
                            </span>
                          )}
                          {b.phone && (
                            <a
                              href={`https://wa.me/${b.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 hover:underline"
                            >
                              💬 {b.phone}
                            </a>
                          )}
                          {b.email && (
                            <a
                              href={`mailto:${b.email}`}
                              className="font-sans text-[#666] hover:text-[#0d2b22] truncate max-w-[200px]"
                            >
                              ✉️ {b.email}
                            </a>
                          )}
                          <span className="font-sans text-[11px] text-[#aaa] ml-auto">
                            {formatDate(b.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap pt-3 md:pt-0 border-t md:border-t-0 border-black/[0.05]">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value as Booking["status"])}
                          className="h-9 px-3 rounded-xl border border-black/[0.08] bg-[#f9f7f4] font-sans text-xs outline-none focus:border-[#7ecab0] transition-all font-medium"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <a
                          href={`https://wa.me/${b.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello ${b.clientName}, this is Hope Counseling Support Services. We are confirming your scheduled session on ${b.date || "your requested date"} (${b.time || "Morning"}). Looking forward to supporting you.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 px-3 bg-[#e0f4ec] text-[#1e5c45] rounded-xl font-sans text-xs font-semibold hover:bg-[#c8eadb] transition-all flex items-center gap-1"
                        >
                          💬 WhatsApp
                        </a>
                        <button
                          onClick={() => deleteBooking(b.id)}
                          className="h-9 px-3 bg-red-50 text-red-600 rounded-xl font-sans text-xs hover:bg-red-100 transition-all border border-red-100 font-medium"
                          title="Delete booking"
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.05] shadow-sm">
              <h2 className="font-instrument text-2xl text-[#0d2b22] mb-1">
                Most Frequent Sessions Booked
              </h2>
              <p className="font-sans text-xs text-[#888] mb-8">
                Ranked by popularity and demand across all client reservations.
              </p>

              {stats.freq.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="font-sans text-sm text-[#888]">
                    No booking analytics yet. Load demo data to preview.
                  </p>
                  <button
                    onClick={seedDemo}
                    className="mt-4 px-5 py-2 bg-[#0d2b22] text-white rounded-full font-sans text-xs font-medium hover:bg-[#1a4a38] transition-all"
                  >
                    Load Sample Data
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {stats.freq.map(([label, count], i) => {
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-sans text-sm text-[#0d2b22] font-semibold">
                            {i + 1}. {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-instrument text-lg text-[#0d2b22] font-bold">
                              {count} {count === 1 ? "booking" : "bookings"}
                            </span>
                            <span className="font-sans text-xs text-[#7ecab0] font-semibold bg-[#0d2b22] px-2 py-0.5 rounded-full">
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-3 bg-[#f0f0f0] rounded-full overflow-hidden p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#1e5c45] to-[#7ecab0]"
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
                    <div
                      className={`inline-block font-sans text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-3 ${STATUS_COLORS[s]}`}
                    >
                      {s}
                    </div>
                    <div className="font-instrument text-4xl text-[#0d2b22] font-semibold">{count}</div>
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
