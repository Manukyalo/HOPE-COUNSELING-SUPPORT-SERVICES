"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, KeyRound, AlertCircle, RefreshCw } from "lucide-react";
import { signInPractitioner, registerPractitioner, formatAuthError } from "@/services/auth-service";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";

  const [authMode, setAuthMode] = useState<"signin" | "register" | "pin">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const establishServerSession = async (authPayload: { email?: string; password?: string; pin?: string; idToken?: string }) => {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authPayload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to establish server session");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authMode === "signin") {
        const user = await signInPractitioner(email, password);
        const token = await user.getIdToken();
        await establishServerSession({ email, password, idToken: token });
      } else {
        const user = await registerPractitioner(email, password);
        const token = await user.getIdToken();
        await establishServerSession({ email, password, idToken: token });
      }
      router.push(redirectTarget);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "auth/unknown";
      setError(formatAuthError(code));
    } finally {
      setLoading(false);
    }
  };

  const handlePinAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // PIN is validated server-side only — no client-side check
      await establishServerSession({ pin });
      router.push(redirectTarget);
    } catch (err: unknown) {
      setError((err as Error).message || "PIN verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071a14] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#143d31]/30 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a241c]/90 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl p-1 bg-gradient-to-b from-[#7ecab0]/40 to-white/5 border border-[#7ecab0]/30 shadow-xl overflow-hidden">
            <img
              src="/icons/icon-192.png"
              alt="Hope Counseling Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <h1 className="font-instrument text-2xl sm:text-3xl text-white font-normal tracking-wide">
            Practitioner Login
          </h1>
          <p className="font-sans text-[11px] text-[#7ecab0] tracking-widest uppercase mt-1">
            Server-Protected Clinical Workspace
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-sans flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {authMode === "pin" ? (
          <form onSubmit={handlePinAuth} className="space-y-4">
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
              disabled={loading}
              className="w-full h-12 bg-[#7ecab0] hover:bg-[#9de4cd] text-[#071a14] rounded-xl font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify PIN"}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setError(null);
              }}
              className="w-full text-center text-xs font-sans text-white/50 hover:text-white pt-2 transition-colors"
            >
              Back to Email Authentication
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-4">
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
              <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-[#7ecab0] mb-2">
                Password
              </label>
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
              disabled={loading}
              className="w-full h-12 mt-2 bg-[#7ecab0] hover:bg-[#9de4cd] text-[#071a14] rounded-xl font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : authMode === "signin" ? (
                "Authenticate Workspace"
              ) : (
                "Register Account"
              )}
            </button>

            <div className="pt-4 flex items-center justify-between text-xs font-sans text-white/50 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "signin" ? "register" : "signin");
                  setError(null);
                }}
                className="hover:text-white"
              >
                {authMode === "signin" ? "Create Account" : "Existing Account Login"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("pin");
                  setError(null);
                }}
                className="text-[#7ecab0] hover:underline"
              >
                Use Emergency PIN
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
