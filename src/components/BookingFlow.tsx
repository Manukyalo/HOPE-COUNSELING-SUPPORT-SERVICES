"use client";

import { useState } from "react";

export default function BookingFlow() {
    const [step, setStep] = useState(1); // 1: Consent, 2: Selection, 3: Confirmation
    const [sessionLink, setSessionLink] = useState("");

    const handleConsent = () => {
        setStep(2);
    };

    const handleBooking = () => {
        // Generate a pseudo-random Jitsi link
        const roomId = Math.random().toString(36).substring(7);
        setSessionLink(`https://meet.jit.si/HopeCounseling_${roomId}`);
        setStep(3);
    };

    return (
        <div className="max-w-3xl mx-auto">
            {step === 1 && (
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-primary-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Informed Consent Form</h2>
                    <div className="prose prose-primary mb-8 text-gray-600 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg text-sm">
                        <p className="mb-4 font-bold">Please read and accept the following terms before booking:</p>
                        <p className="mb-4">1. Confidentiality: Sessions are private and confidential between the counselor and the client.</p>
                        <p className="mb-4">2. Technology: We use secure virtual platforms for sessions. Ensure you have a private space and stable internet.</p>
                        <p className="mb-4">3. Emergency: In case of crisis, please contact local emergency services immediately as this platform is for scheduled counseling.</p>
                        <p className="mb-4">4. Cancellation: Please provide 24-hour notice for any session cancellations.</p>
                        <p>By clicking accept, you agree to the terms of service and privacy policy of Hope Counseling Support Services.</p>
                    </div>
                    <button
                        onClick={handleConsent}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg"
                    >
                        I Accept and Agree to the Terms
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-primary-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Select a Session Time</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {["09:00 AM", "11:00 AM", "01:30 PM", "03:00 PM", "05:00 PM"].map((time) => (
                            <button
                                key={time}
                                className="py-3 px-4 border border-primary-200 rounded-lg hover:bg-primary-500 hover:text-white transition-colors font-medium"
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleBooking}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg"
                    >
                        Confirm Booking
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-primary-600 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        ✓
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Session Confirmed!</h2>
                    <p className="text-gray-600 mb-8">Your appointment has been scheduled. Your counselor will meet you at the link below.</p>

                    <div className="bg-primary-50 p-6 rounded-xl border border-dashed border-primary-400 mb-8">
                        <p className="text-sm text-primary-700 font-semibold mb-2 uppercase tracking-wider">Your Virtual Meeting Link</p>
                        <a
                            href={sessionLink}
                            target="_blank"
                            className="text-lg md:text-xl font-mono text-primary-800 break-all underline hover:text-primary-600"
                        >
                            {sessionLink}
                        </a>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setStep(1)}
                            className="text-gray-500 underline text-sm"
                        >
                            Book another session
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
