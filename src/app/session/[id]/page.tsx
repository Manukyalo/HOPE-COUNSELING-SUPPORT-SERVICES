"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LiveSession({ params }: { params: { id: string } }) {
    const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt");
    const roomName = `HopeCounseling_${params.id}`;

    useEffect(() => {
        // Check for camera/mic permissions
        async function checkPermissions() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setPermissionState("granted");
                // Stop stream immediately after check, Jitsi will restart it
                stream.getTracks().forEach(track => track.stop());
            } catch (err) {
                setPermissionState("denied");
            }
        }
        checkPermissions();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col pt-20">
            {/* Header */}
            <div className="bg-gray-900 border-b border-white/5 p-4 flex justify-between items-center">
                <div>
                    <h1 className="text-white font-bold tracking-tight">Session Room: {params.id}</h1>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Status: Secure & Encrypted</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
                        LEAVE SESSION
                    </button>
                </div>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row p-6 gap-6">
                {/* Video Area */}
                <div className="flex-grow bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/5">
                    {permissionState === "granted" ? (
                        <iframe
                            src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`}
                            className="w-full h-full border-none"
                            allow="camera; microphone; display-capture; autoplay; clipboard-write"
                        />
                    ) : permissionState === "denied" ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-4xl mb-6">!</div>
                            <h2 className="text-2xl font-bold text-white mb-4">Hardware Access Denied</h2>
                            <p className="text-gray-400 max-w-sm mb-8">Please enable camera and microphone access in your browser settings to join the session.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-primary-400 transition-colors"
                            >
                                Retry Access
                            </button>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mb-6"
                            />
                            <h2 className="text-xl font-bold text-white mb-2">Requesting Access</h2>
                            <p className="text-gray-500">Please click "Allow" when prompted by your browser.</p>
                        </div>
                    )}
                </div>

                {/* Info/Chat Area */}
                <div className="w-full lg:w-96 flex flex-col gap-6">
                    <div className="bg-gray-900 rounded-3xl p-6 border border-white/5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Live Participants
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
                                <span className="text-gray-300 font-medium">Counselor (You)</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-50">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">U</div>
                                <span className="text-gray-500 font-medium italic">Waiting for Client...</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow bg-gray-900 rounded-3xl p-6 border border-white/5 flex flex-col">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Digital Notebook</h3>
                        <textarea
                            placeholder="Take private notes here during the session..."
                            className="flex-grow bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 text-sm focus:border-primary-500/50 outline-none resize-none"
                        />
                        <button className="mt-4 w-full py-3 bg-primary-600/10 text-primary-400 font-bold rounded-xl border border-primary-600/20 hover:bg-primary-600 hover:text-white transition-all text-xs">
                            SAVE NOTES
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
