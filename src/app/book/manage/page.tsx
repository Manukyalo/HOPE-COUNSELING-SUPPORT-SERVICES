"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";

function ManageBookingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const action = searchParams.get("action");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [booking, setBooking] = useState<{
    id: string;
    date: string;
    timeFormatted: string;
    sessionType: string;
    deliveryMode: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    if (!token || !action) {
      setError("Invalid or missing booking link.");
      setLoading(false);
      return;
    }

    async function fetchDetails() {
      try {
        const res = await fetch(`/api/booking/manage?action=${action}&token=${token}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Unable to find this booking session.");
        } else {
          setBooking(data.booking);
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [token, action]);

  const handleConfirmCancel = async () => {
    if (!token) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/booking/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to cancel session.");
      } else {
        setSuccessMessage("Your appointment has been successfully cancelled.");
        if (booking) {
          setBooking({ ...booking, status: "cancelled" });
        }
      }
    } catch {
      setError("An unexpected error occurred. Please contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-6 sm:p-8">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#666] hover:text-[#0d2b22] font-sans transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="font-playfair text-2xl text-[#0d2b22]">Manage Appointment</h1>
          <p className="font-sans text-xs text-[#888] mt-1">
            Hope Counseling Support Services
          </p>
        </div>

        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-7 h-7 text-[#7ecab0] animate-spin" />
            <p className="font-sans text-xs text-[#888]">Loading session details...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200/60 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans text-xs font-medium text-red-800">{error}</p>
              <p className="font-sans text-[11px] text-red-600 mt-1">
                If you need assistance, please WhatsApp our office at +254 701 279 231.
              </p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <p className="font-sans text-sm font-medium text-emerald-900">{successMessage}</p>
            <p className="font-sans text-xs text-emerald-700">
              The time slot has been freed. You are welcome to book another date whenever you are ready.
            </p>
            <Link
              href="/#book"
              className="mt-4 px-6 py-2.5 bg-[#0d2b22] text-[#7ecab0] rounded-full font-sans text-xs uppercase tracking-widest font-medium hover:bg-[#1a4a38] transition-all"
            >
              Book New Session
            </Link>
          </div>
        )}

        {!loading && !error && !successMessage && booking && (
          <div className="space-y-6">
            <div className="bg-[#f9f7f4] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-black/5">
                <span className="text-[#888] font-sans">Reference</span>
                <span className="font-mono font-medium text-[#0d2b22]">{booking.id}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#0d2b22]">
                <Calendar className="w-4 h-4 text-[#7ecab0]" />
                <span className="font-sans font-medium">{booking.date}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#0d2b22]">
                <Clock className="w-4 h-4 text-[#7ecab0]" />
                <span className="font-sans font-medium">{booking.timeFormatted} (East Africa Time)</span>
              </div>
              <div className="text-xs text-[#666] font-sans pt-1">
                Format: <span className="font-medium text-[#0d2b22] capitalize">{booking.deliveryMode}</span> ({booking.sessionType})
              </div>
            </div>

            {booking.status === "cancelled" ? (
              <div className="text-center py-4">
                <p className="font-sans text-xs text-[#888]">This session has already been cancelled.</p>
                <Link
                  href="/#book"
                  className="mt-4 inline-block px-6 py-2.5 bg-[#0d2b22] text-[#7ecab0] rounded-full font-sans text-xs uppercase tracking-widest font-medium hover:bg-[#1a4a38] transition-all"
                >
                  Book Another Session
                </Link>
              </div>
            ) : action === "cancel" ? (
              <div className="space-y-3">
                <p className="font-sans text-xs text-[#666] text-center">
                  Are you sure you want to cancel this appointment?
                </p>
                <button
                  onClick={handleConfirmCancel}
                  disabled={submitting}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-sans text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="font-sans text-xs text-[#666]">
                  To choose a new time for your appointment, please book a new slot and your previous slot will be safely rescheduled.
                </p>
                <Link
                  href="/#book"
                  className="w-full inline-block py-3 bg-[#0d2b22] text-[#7ecab0] rounded-xl font-sans text-xs uppercase tracking-widest font-medium hover:bg-[#1a4a38] transition-all"
                >
                  Pick New Time
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManageBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#7ecab0] animate-spin" />
        </div>
      }
    >
      <ManageBookingContent />
    </Suspense>
  );
}
