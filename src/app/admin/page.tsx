"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  LogOut,
  RefreshCw,
  Bell,
  BellRing,
  FileText,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Lock,
  KeyRound,
  Save,
  MessageSquare,
  Trash2,
} from "lucide-react";
import {
  subscribeToBookingSessions,
  fetchAdminBookings,
  updateSessionStatus,
  updateSessionNotes,
  deleteSession,
  markSessionSeen,
  BookingSession,
} from "@/services/booking-service";
import AvailabilitySettingsTab from "@/components/admin/AvailabilitySettingsTab";
import BlockedDatesTab from "@/components/admin/BlockedDatesTab";
import {
  signInPractitioner,
  registerPractitioner,
  resetPractitionerPassword,
  signOutPractitioner,
  onPractitionerAuthStateChanged,
  formatAuthError,
  AuthUser,
} from "@/services/auth-service";
import {
  sendBookingNotification,
  requestNotificationPermission,
} from "@/lib/pwa-notifications";

// ─── Constants & Metadata ─────────────────────────────────────────────────────

const SERVICE_CATALOG: Record<string, { label: string; price: number; duration: string }> = {
  individual: { label: "Individual Counselling", price: 1000, duration: "50–60 min" },
  online: { label: "Online Counselling", price: 800, duration: "50–60 min" },
  student: { label: "Student & Young Adult Support", price: 700, duration: "50–60 min" },
  couples: { label: "Couples / Relationship Counselling", price: 1500, duration: "60 min" },
  initial: { label: "Initial Consultation", price: 300, duration: "30 min" },
  "student-pkg": { label: "Student Wellness Package (4 Sessions)", price: 2500, duration: "4 weeks" },
  "personal-pkg": { label: "Personal Growth Package (4 Sessions)", price: 3600, duration: "4 weeks" },
  "extended-pkg": { label: "Extended Support Package (6 Sessions)", price: 5000, duration: "6 weeks" },
};

const STATUS_CONFIG: Record<
  BookingSession["status"],
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Pending: {
    label: "Pending Review",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  Confirmed: {
    label: "Confirmed",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  Completed: {
    label: "Completed",
    bg: "bg-sky-500/10",
    text: "text-sky-300",
    border: "border-sky-500/20",
    dot: "bg-sky-400",
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
  },
  no_show: {
    label: "No Show",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClinicalAdminPortal() {
  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "register" | "forgot" | "pin">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Portal state
  const [sessions, setSessions] = useState<BookingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<BookingSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"manifest" | "availability" | "blocked" | "analytics">("manifest");
  const [notesDraft, setNotesDraft] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Notifications & PWA
  const [notifState, setNotifState] = useState<NotificationPermission>("default");
  const [liveBanner, setLiveBanner] = useState<BookingSession | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  // ── Auth initialization ─────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onPractitionerAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "Counselor",
        });
        // Sync httpOnly admin session cookie with server
        try {
          const idToken = await firebaseUser.getIdToken();
          await fetch("/api/admin/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
        } catch (err) {
          console.warn("[admin] Failed to sync session cookie:", err);
        }
      } else {
        setUser(null);
      }
    });

    if (typeof window !== "undefined") {
      if ("Notification" in window) {
        setNotifState(Notification.permission);
      }
      setIsStandalone(
        window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    }

    const installHandler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", installHandler);

    return () => {
      unsub();
      window.removeEventListener("beforeinstallprompt", installHandler);
    };
  }, []);

  // ── Real-time Firestore sync ────────────────────────────────────────────────
  useEffect(() => {
    if (!user && !isPinUnlocked) return;

    const unsubscribe = subscribeToBookingSessions((updated) => {
      setSessions(updated);
    });

    const handleCustomBooking = (e: Event) => {
      const custom = e as CustomEvent<BookingSession>;
      if (custom.detail) {
        setLiveBanner(custom.detail);
        sendBookingNotification(custom.detail);
      }
    };
    window.addEventListener("hope:new-booking", handleCustomBooking);

    return () => {
      unsubscribe();
      window.removeEventListener("hope:new-booking", handleCustomBooking);
    };
  }, [user, isPinUnlocked]);

  // ── Auth Actions ────────────────────────────────────────────────────────────
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const userCred = await signInPractitioner(email, password);
      const idToken = await userCred.getIdToken();
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "auth/unknown";
      setAuthError(formatAuthError(code));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      await registerPractitioner(email, password);
      setAuthSuccess("Practitioner account registered successfully.");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "auth/unknown";
      setAuthError(formatAuthError(code));
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError("Please provide your email address.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await resetPractitionerPassword(email);
      setAuthSuccess("Password reset instructions dispatched to your email.");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "auth/unknown";
      setAuthError(formatAuthError(code));
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePinUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    // PIN is validated server-side only via /api/admin/auth
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setIsPinUnlocked(true);
        setAuthError(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || "Invalid authorization PIN code.");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    }
  };

  const handleSignOut = async () => {
    setIsPinUnlocked(false);
    await signOutPractitioner();
  };

  // ── PWA & Notifications ────────────────────────────────────────────────────
  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    setNotifState(res);
    if (res === "granted") {
      sendBookingNotification({
        id: "PWA-VERIFY",
        clientName: "Hope Clinical System",
        email: "counselor@hopecounseling.ke",
        phone: "+254701279231",
        serviceId: "initial",
        serviceName: "Realtime Notification Engine Active",
        date: "Today",
        time: "Active",
      });
    }
  };

  const handleTestAlert = () => {
    // Uses a system-labelled test session — no PII or realistic-looking client data
    const testSession: BookingSession = {
      id: "SYS-TEST-" + Math.floor(1000 + Math.random() * 9000),
      clientName: "[Notification Test]",
      email: "system@hopecounseling.ke",
      phone: "+2547XXXXXXXX",
      serviceId: "initial",
      serviceName: "System Notification Test",
      date: new Date().toLocaleDateString("en-KE"),
      time: new Date().toLocaleTimeString("en-KE"),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setLiveBanner(testSession);
    sendBookingNotification(testSession);
  };

  const handleInstallPwa = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsStandalone(true);
      setInstallPrompt(null);
    }
  };

  // ── Clinical Operations ────────────────────────────────────────────────────
  const handleStatusChange = async (id: string, status: BookingSession["status"]) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s))
    );
    if (selectedSession && selectedSession.id === id) {
      setSelectedSession((prev) => (prev ? { ...prev, status } : null));
    }
    await updateSessionStatus(id, status);
  };

  const handleSaveNotes = async () => {
    if (!selectedSession) return;
    setIsSavingNotes(true);
    await updateSessionNotes(selectedSession.id, notesDraft);
    setSelectedSession((prev) => (prev ? { ...prev, notes: notesDraft } : null));
    setIsSavingNotes(false);
  };

  const handleDeleteSession = async (id: string, clientName?: string) => {
    const nameStr = clientName ? ` for "${clientName}"` : "";
    if (
      !window.confirm(
        `Are you sure you want to permanently delete this booking${nameStr}? This action cannot be undone and will free up any reserved slot.`
      )
    ) {
      return;
    }

    // Optimistically remove from state so it immediately disappears from UI
    setSessions((prev) => prev.filter((s) => s.id !== id && s.referenceCode !== id));
    if (selectedSession?.id === id || selectedSession?.referenceCode === id) {
      setSelectedSession(null);
    }

    const success = await deleteSession(id);
    if (!success) {
      alert("Failed to delete booking from database. Please verify your connection.");
      const refreshed = await fetchAdminBookings();
      setSessions(refreshed);
    }
  };

  const handlePurgeCancelled = async () => {
    const cancelled = sessions.filter((s) => s.status === "Cancelled");
    if (cancelled.length === 0) return;
    if (
      !window.confirm(
        `Permanently delete all ${cancelled.length} cancelled booking(s)? This will permanently clear them from the database.`
      )
    ) {
      return;
    }

    const cancelledIds = cancelled.map((s) => s.id);
    setSessions((prev) => prev.filter((s) => s.status !== "Cancelled"));
    if (selectedSession && selectedSession.status === "Cancelled") {
      setSelectedSession(null);
    }

    await Promise.allSettled(cancelledIds.map((id) => deleteSession(id)));
  };

  // ── Filtered & Computed Analytics ──────────────────────────────────────────
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.clientName.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.serviceName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [sessions, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = sessions.length;
    const pending = sessions.filter((s) => s.status === "Pending").length;
    const confirmed = sessions.filter((s) => s.status === "Confirmed").length;
    const completed = sessions.filter((s) => s.status === "Completed").length;

    // Financial volume estimate in KSh
    const grossVolume = sessions.reduce((acc, s) => {
      const price = SERVICE_CATALOG[s.serviceId]?.price || 1000;
      return s.status !== "Cancelled" ? acc + price : acc;
    }, 0);

    // Distribution
    const serviceDistribution: Record<string, number> = {};
    sessions.forEach((s) => {
      const name = SERVICE_CATALOG[s.serviceId]?.label || s.serviceName;
      serviceDistribution[name] = (serviceDistribution[name] || 0) + 1;
    });

    const rankedServices = Object.entries(serviceDistribution).sort((a, b) => b[1] - a[1]);

    return { total, pending, confirmed, completed, grossVolume, rankedServices };
  }, [sessions]);


  // ─── AUTHENTICATION SCREEN ──────────────────────────────────────────────────
  if (!user && !isPinUnlocked) {
    return (
      <div className="min-h-screen bg-[#071a14] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#143d31]/30 blur-[130px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0a241c]/90 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10"
        >
          {/* Practice Emblem */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl p-1 bg-gradient-to-b from-[#7ecab0]/40 to-white/5 border border-[#7ecab0]/30 shadow-xl overflow-hidden">
              <img
                src="/icons/icon-192.png"
                alt="Hope Counseling Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h1 className="font-instrument text-2xl sm:text-3xl text-white font-normal tracking-wide">
              Practitioner Workspace
            </h1>
            <p className="font-sans text-[11px] text-[#7ecab0] tracking-widest uppercase mt-1">
              Hope Counseling Support Services · Nairobi
            </p>
          </div>

          {/* Feedback Alerts */}
          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-sans flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-sans flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Mode: Email Sign In / Registration */}
          {(authMode === "signin" || authMode === "register") && (
            <form onSubmit={authMode === "signin" ? handleEmailSignIn : handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-[#7ecab0] mb-2">
                  Clinical Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="counselor@hopecounseling.ke"
                    className="w-full h-12 bg-white/[0.04] border border-white/10 focus:border-[#7ecab0] rounded-xl px-4 pl-10 font-sans text-sm text-white placeholder:text-white/20 outline-none transition-all"
                  />
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#7ecab0]">
                    Secure Password
                  </label>
                  {authMode === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("forgot");
                        setAuthError(null);
                      }}
                      className="text-[11px] font-sans text-white/50 hover:text-[#7ecab0] transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 bg-white/[0.04] border border-white/10 focus:border-[#7ecab0] rounded-xl px-4 pl-10 font-sans text-sm text-white placeholder:text-white/20 outline-none transition-all"
                  />
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 mt-2 bg-[#7ecab0] hover:bg-[#9de4cd] text-[#071a14] rounded-xl font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#7ecab0]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : authMode === "signin" ? (
                  "Authenticate Workspace"
                ) : (
                  "Create Practitioner Profile"
                )}
              </button>
            </form>
          )}

          {/* Mode: Forgot Password */}
          {authMode === "forgot" && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <p className="text-xs font-sans text-white/60 mb-2">
                Enter your registered practitioner email to receive reset credentials.
              </p>
              <div>
                <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-[#7ecab0] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="counselor@hopecounseling.ke"
                  className="w-full h-12 bg-white/[0.04] border border-white/10 focus:border-[#7ecab0] rounded-xl px-4 font-sans text-sm text-white placeholder:text-white/20 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 bg-[#7ecab0] hover:bg-[#9de4cd] text-[#071a14] rounded-xl font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                {authLoading ? "Dispatching..." : "Send Reset Instructions"}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className="w-full text-center text-xs font-sans text-white/50 hover:text-white pt-2 transition-colors"
              >
                Return to Login
              </button>
            </form>
          )}

          {/* Mode: Emergency PIN Fallback */}
          {authMode === "pin" && (
            <form onSubmit={handlePinUnlock} className="space-y-4">
              <p className="text-xs font-sans text-white/60 mb-2">
                Clinical PIN bypass provides immediate consultation access when credentials are unavailable.
              </p>
              <div>
                <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-[#7ecab0] mb-2">
                  Clinical PIN Code
                </label>
                <div className="relative">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter your authorization PIN"
                    className="w-full h-12 bg-white/[0.04] border border-white/10 focus:border-[#7ecab0] rounded-xl px-4 pl-10 font-mono tracking-widest text-center text-lg text-white outline-none transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#7ecab0] hover:bg-[#9de4cd] text-[#071a14] rounded-xl font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Unlock Emergency Session
              </button>

              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className="w-full text-center text-xs font-sans text-white/50 hover:text-white pt-2 transition-colors"
              >
                Return to Email Login
              </button>
            </form>
          )}

          {/* Mode Switchers */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-sans text-white/50">
            {authMode === "signin" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError(null);
                  }}
                  className="hover:text-white transition-colors"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("pin");
                    setAuthError(null);
                  }}
                  className="text-[#7ecab0] hover:underline"
                >
                  Use PIN Code
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signin");
                  setAuthError(null);
                }}
                className="hover:text-white transition-colors mx-auto"
              >
                Sign In with Email
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── CLINICAL WORKSPACE PORTAL ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#071a14] text-white flex flex-col font-sans">
      {/* ── Realtime Toast Notification ── */}
      <AnimatePresence>
        {liveBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            className="fixed top-5 right-5 z-50 max-w-sm w-full bg-[#0d2e24] border border-[#7ecab0]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#7ecab0]/20 border border-[#7ecab0]/30 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-[#7ecab0] animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7ecab0]">
                  New Client Reserved
                </span>
              </div>
              <h4 className="font-instrument text-base text-white truncate">
                {liveBanner.clientName}
              </h4>
              <p className="text-xs text-white/70 truncate mt-0.5">
                {liveBanner.serviceName}
              </p>
              <div className="text-[11px] text-white/50 mt-1 flex flex-wrap gap-2">
                <span>📅 {liveBanner.date || "Date Pending"}</span>
                <span>📞 {liveBanner.phone}</span>
              </div>
            </div>
            <button
              onClick={() => setLiveBanner(null)}
              className="text-white/40 hover:text-white text-base leading-none p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Clinical Navigation Header ── */}
      <header className="bg-[#0a241c]/95 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand & Counselor Indicator */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#7ecab0]/30 shadow-md shrink-0">
              <img src="/icons/icon-192.png" alt="Emblem" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-instrument text-lg sm:text-xl text-white tracking-wide">
                  Hope Counseling
                </h1>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Firebase Live
                </span>
              </div>
              <p className="text-[10px] text-white/50 tracking-wider font-sans">
                {user?.email || "Authenticated Counselor (PIN Bypass)"}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {installPrompt && !isStandalone && (
              <button
                onClick={handleInstallPwa}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7ecab0] text-[#071a14] text-xs font-bold uppercase tracking-wider hover:bg-[#9de4cd] transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install PWA</span>
              </button>
            )}

            {notifState !== "granted" ? (
              <button
                onClick={handleEnableNotifications}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-all"
                title="Enable device push alerts"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Enable Alerts</span>
              </button>
            ) : (
              <button
                onClick={handleTestAlert}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
                title="Send test alert to device"
              >
                <BellRing className="w-3.5 h-3.5 text-[#7ecab0]" />
                <span className="hidden md:inline">Test Alert</span>
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Workspace Body ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 space-y-6">

        {/* Clinical Metric Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: "Active Manifest",
              value: stats.total,
              sub: "Total registered",
              icon: Activity,
              accent: "text-white",
            },
            {
              label: "Pending Review",
              value: stats.pending,
              sub: "Requires intake",
              icon: Clock,
              accent: "text-amber-400",
            },
            {
              label: "Confirmed Sessions",
              value: stats.confirmed,
              sub: "Scheduled clients",
              icon: CheckCircle2,
              accent: "text-emerald-400",
            },
            {
              label: "Completed Journey",
              value: stats.completed,
              sub: "Successfully supported",
              icon: ShieldCheck,
              accent: "text-sky-400",
            },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-white/50">
                    {item.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    <IconComponent className={`w-4 h-4 ${item.accent}`} />
                  </div>
                </div>
                <div className={`font-instrument text-3xl sm:text-4xl ${item.accent} leading-none`}>
                  {item.value}
                </div>
                <p className="text-[11px] text-white/40 mt-1 font-sans">{item.sub}</p>
              </div>
            );
          })}
        </div>

        {/* View Selection Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("manifest")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "manifest"
                  ? "bg-[#7ecab0] text-[#071a14] shadow-md shadow-[#7ecab0]/20"
                  : "bg-white/[0.04] text-white/60 hover:text-white border border-white/10"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Session Manifest</span>
            </button>
            <button
              onClick={() => setActiveTab("availability")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "availability"
                  ? "bg-[#7ecab0] text-[#071a14] shadow-md shadow-[#7ecab0]/20"
                  : "bg-white/[0.04] text-white/60 hover:text-white border border-white/10"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Schedule & Hours</span>
            </button>
            <button
              onClick={() => setActiveTab("blocked")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "blocked"
                  ? "bg-[#7ecab0] text-[#071a14] shadow-md shadow-[#7ecab0]/20"
                  : "bg-white/[0.04] text-white/60 hover:text-white border border-white/10"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Blocked Dates</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-[#7ecab0] text-[#071a14] shadow-md shadow-[#7ecab0]/20"
                  : "bg-white/[0.04] text-white/60 hover:text-white border border-white/10"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Practice Analytics</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-white/50">
            <span>Volume Estimate:</span>
            <span className="font-instrument text-base text-[#7ecab0] font-normal">
              KSh {stats.grossVolume.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── TAB 1: SESSION MANIFEST ── */}
        {activeTab === "manifest" && (
          <div className="space-y-4">
            {/* Search and Status Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by client name, phone number, or session type..."
                  className="w-full h-11 bg-[#0a241c]/60 border border-white/10 focus:border-[#7ecab0] rounded-xl pl-10 pr-4 text-xs font-sans text-white placeholder:text-white/30 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/40 shrink-0 hidden sm:block" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 bg-[#0a241c]/60 border border-white/10 focus:border-[#7ecab0] rounded-xl px-3 text-xs font-sans text-white outline-none cursor-pointer"
                >
                  <option value="all">All Statuses ({sessions.length})</option>
                  <option value="Pending">Pending Review ({stats.pending})</option>
                  <option value="Confirmed">Confirmed ({stats.confirmed})</option>
                  <option value="Completed">Completed ({stats.completed})</option>
                  <option value="Cancelled">
                    Cancelled ({sessions.filter((s) => s.status === "Cancelled").length})
                  </option>
                </select>

                {sessions.some((s) => s.status === "Cancelled") && (
                  <button
                    type="button"
                    onClick={handlePurgeCancelled}
                    className="h-11 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
                    title="Permanently delete all cancelled bookings"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Purge Cancelled</span>
                    <span>({sessions.filter((s) => s.status === "Cancelled").length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Session Cards or Zero State */}
            {filteredSessions.length === 0 ? (
              <div className="bg-[#0a241c]/40 border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#7ecab0]">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-instrument text-2xl text-white mb-1">
                  No Client Sessions Found
                </h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto mb-6">
                  {sessions.length === 0
                    ? "Your clinical session ledger is empty. New client bookings will appear here in real time."
                    : "No sessions matched your search criteria."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSessions.map((session) => {
                  const statusMeta = STATUS_CONFIG[session.status];
                  return (
                    <motion.div
                      key={session.id}
                      layout
                      className="bg-[#0a241c]/70 hover:bg-[#0d2e24] border border-white/10 rounded-2xl p-4 sm:p-5 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Client info & Schedule */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          {session.adminSeen === false && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-400 text-black shadow-sm animate-pulse">
                              NEW
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-white/40 tracking-wider">
                            {session.referenceCode || session.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                            {statusMeta.label}
                          </span>
                          {session.deliveryMode && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-white/70 border border-white/5">
                              {session.deliveryMode === "online" ? "Online Video" : "In-Person Clinic"}
                            </span>
                          )}
                          <span className="text-[11px] text-white/40 font-sans ml-auto md:ml-0">
                            {formatDate(session.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <h3 className="font-instrument text-xl text-white tracking-wide">
                            {session.clientName}
                          </h3>
                        </div>

                        <p className="text-xs text-[#7ecab0] font-medium mt-0.5">
                          {session.serviceName}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-white/60">
                          {session.date && (
                            <span className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5 text-white/80">
                              <Calendar className="w-3 h-3 text-[#7ecab0]" />
                              <span>{session.date} · {session.time || "Morning"}</span>
                            </span>
                          )}
                          <a
                            href={`https://wa.me/${session.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{session.phone}</span>
                          </a>
                          {session.email && (
                            <a
                              href={`mailto:${session.email}`}
                              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
                            >
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[180px]">{session.email}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/10 flex-wrap">
                        {/* Status dropdown */}
                        <select
                          value={session.status}
                          onChange={(e) =>
                            handleStatusChange(session.id, e.target.value as BookingSession["status"])
                          }
                          className="h-9 bg-white/[0.05] border border-white/10 focus:border-[#7ecab0] rounded-xl px-2.5 text-xs font-sans text-white outline-none cursor-pointer"
                        >
                          <option value="Pending" className="bg-[#071a14]">Pending</option>
                          <option value="Confirmed" className="bg-[#071a14]">Confirmed</option>
                          <option value="Completed" className="bg-[#071a14]">Completed</option>
                          <option value="Cancelled" className="bg-[#071a14]">Cancelled</option>
                        </select>

                        {/* WhatsApp dispatch */}
                        <a
                          href={`https://wa.me/${session.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello ${session.clientName}, Hope Counseling Support Services is pleased to confirm your upcoming session scheduled for ${
                              session.date || "your requested date"
                            } (${session.time || "Morning"}). Please let us know if you have any questions prior to our consultation.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-xs font-medium transition-all flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Open Profile Modal */}
                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            setNotesDraft(session.notes || "");
                            if (session.adminSeen === false) {
                              markSessionSeen(session.id);
                            }
                          }}
                          className="h-9 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <span>Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                        </button>

                        {/* Permanent Delete Button directly on card */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(session.id, session.clientName)}
                          title="Permanently delete booking"
                          className="h-9 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-medium transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: PRACTICE ANALYTICS ── */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Session Type Breakdown */}
            <div className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="font-instrument text-2xl text-white mb-1">
                Consultation Frequency & Demand
              </h2>
              <p className="text-xs text-white/50 mb-6 font-sans">
                Ranked by demand across all booked clinical counseling requests.
              </p>

              {stats.rankedServices.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40">
                  No consultation data recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.rankedServices.map(([label, count], i) => {
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white font-medium">
                            {i + 1}. {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-instrument text-base text-white">
                              {count} {count === 1 ? "booking" : "bookings"}
                            </span>
                            <span className="font-mono text-[11px] text-[#7ecab0] bg-[#7ecab0]/10 px-2 py-0.5 rounded border border-[#7ecab0]/20">
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#143d31] to-[#7ecab0] transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status Breakdown Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["Pending", "Confirmed", "Completed", "Cancelled"] as const).map((st) => {
                const count = sessions.filter((s) => s.status === st).length;
                const meta = STATUS_CONFIG[st];
                return (
                  <div
                    key={st}
                    className="bg-[#0a241c]/70 border border-white/10 rounded-2xl p-5 shadow-sm"
                  >
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-3 ${meta.bg} ${meta.text} ${meta.border}`}
                    >
                      {st}
                    </span>
                    <div className="font-instrument text-4xl text-white leading-none">
                      {count}
                    </div>
                    <p className="text-[11px] text-white/40 font-sans mt-1">
                      {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% of all intake
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: SCHEDULE & HOURS ── */}
        {activeTab === "availability" && <AvailabilitySettingsTab />}

        {/* ── TAB 4: BLOCKED DATES ── */}
        {activeTab === "blocked" && <BlockedDatesTab />}
      </main>

      {/* ── CLIENT DOSSIER & CLINICAL NOTES SLIDE-OVER MODAL ── */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a241c] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-white/40">{selectedSession.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        STATUS_CONFIG[selectedSession.status].bg
                      } ${STATUS_CONFIG[selectedSession.status].text} ${
                        STATUS_CONFIG[selectedSession.status].border
                      }`}
                    >
                      {selectedSession.status}
                    </span>
                  </div>
                  <h3 className="font-instrument text-2xl text-white">
                    {selectedSession.clientName}
                  </h3>
                  <p className="text-xs text-[#7ecab0] mt-0.5 font-medium">
                    {selectedSession.serviceName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs font-sans">
                {/* Contact & Scheduled Time */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">
                      Session Schedule
                    </span>
                    <p className="text-white font-medium">
                      {selectedSession.date || "Date Unspecified"}
                    </p>
                    <p className="text-white/60 text-[11px]">{selectedSession.time || "Morning"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1">
                      Client Contact
                    </span>
                    <p className="text-emerald-400 font-medium">{selectedSession.phone}</p>
                    <p className="text-white/60 text-[11px] truncate">{selectedSession.email}</p>
                  </div>
                </div>

                {/* Confidential Clinical Notes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#7ecab0]">
                      Confidential Clinical Notes (Practitioner Only)
                    </label>
                    <span className="text-[10px] text-white/40">Encrypted in Firestore</span>
                  </div>
                  <textarea
                    rows={5}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Document clinical observations, presenting symptoms, coping strategies, or agreed milestones..."
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#7ecab0] rounded-xl p-3 text-xs text-white placeholder:text-white/20 outline-none resize-none transition-all"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      className="px-4 py-2 bg-[#7ecab0] hover:bg-[#9de4cd] text-[#071a14] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 mr-1">
                  Change Status:
                </span>
                {selectedSession.status !== "Confirmed" && (
                  <button
                    onClick={() => handleStatusChange(selectedSession.id, "Confirmed")}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-all"
                  >
                    Confirm
                  </button>
                )}
                {selectedSession.status !== "Completed" && (
                  <button
                    onClick={() => handleStatusChange(selectedSession.id, "Completed")}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs font-semibold transition-all"
                  >
                    Complete
                  </button>
                )}
                {selectedSession.status !== "Cancelled" && (
                  <button
                    onClick={() => handleStatusChange(selectedSession.id, "Cancelled")}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold transition-all"
                  >
                    Cancel Slot
                  </button>
                )}
                {selectedSession.status !== "no_show" && (
                  <button
                    onClick={() => handleStatusChange(selectedSession.id, "no_show")}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-all"
                  >
                    No Show
                  </button>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteSession(selectedSession.id, selectedSession.clientName)}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Booking Permanently</span>
                </button>

                <a
                  href={`https://wa.me/${selectedSession.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Client</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
