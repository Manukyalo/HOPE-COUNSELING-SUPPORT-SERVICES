"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = 'force-dynamic';

export default function LiveSession({ params }: { params: { id: string } }) {
    const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Role detection
    const isCounselor = params.id.startsWith("Counselor-");
    const sessionId = params.id.replace(/^(Counselor-|Client-)/, "");
    const roomName = `HopeCounseling_${sessionId}`;

    useEffect(() => {
        async function checkPermissions() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setPermissionState("granted");
                stream.getTracks().forEach(track => track.stop());
            } catch (err) {
                setPermissionState("denied");
            }
        }
        checkPermissions();
    }, []);

    // Jitsi configuration based on role
    // config.enableLobby=true for counselor to manage the room
    const jitsiConfig = isCounselor
        ? "#config.enableLobby=true&config.prejoinPageEnabled=false"
        : "#config.prejoinPageEnabled=true";

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col pt-20">
            {/* Header */}
            <div className="bg-gray-900 border-b border-white/5 p-4 flex justify-between items-center z-20">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 text-white rounded-xl flex items-center justify-center border border-white/10 transition-all font-bold"
                        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {isSidebarOpen ? "⇠" : "⇢"}
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-white font-bold tracking-tight">
                                {isCounselor ? "Counselor Dashboard" : "Client Session"}
                            </h1>
                            <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-[9px] font-black rounded-md uppercase tracking-widest border border-primary-500/20">
                                {sessionId.split('_')[0]}
                            </span>
                        </div>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">
                            {isCounselor ? "Managing Secure Waiting Room" : "Encrypted Connection Active"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-5 py-2.5 bg-red-600/10 text-red-400 border border-red-600/20 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest"
                    >
                        END SESSION
                    </button>
                </div>
            </div>

            <div className="flex-grow flex p-4 gap-4 overflow-hidden relative">
                {/* Video Area */}
                <motion.div
                    layout
                    className="flex-grow bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5"
                >
                    {permissionState === "granted" ? (
                        <iframe
                            src={`https://meet.jit.si/${roomName}${jitsiConfig}`}
                            className="w-full h-full border-none"
                            allow="camera; microphone; display-capture; autoplay; clipboard-write"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mb-6"
                            />
                            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Initialising Secure Bridge</h2>
                            <p className="text-gray-500">Connecting to encrypted servers...</p>
                        </div>
                    )}
                </motion.div>

                {/* Info Sidebar */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="w-96 flex flex-col gap-4 flex-shrink-0"
                        >
                            <div className="bg-gray-900 rounded-[2rem] p-8 border border-white/5">
                                <h3 className="text-white font-black mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Session Status
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Role</p>
                                        <p className="text-white font-bold">{isCounselor ? "Counselor (Host)" : "Client (Guest)"}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Security</p>
                                        <p className="text-emerald-400 font-bold flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                            End-to-End Encrypted
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {isCounselor ? (
                                <div className="flex-grow bg-gray-900 rounded-[2rem] p-8 border border-white/5 flex flex-col">
                                    <h3 className="text-white font-black mb-6 text-xs uppercase tracking-[0.2em]">Counseling Notes</h3>
                                    <textarea
                                        placeholder="Record clinical observations..."
                                        className="flex-grow bg-black/40 border border-white/10 rounded-2xl p-6 text-gray-300 text-sm focus:border-primary-500/50 outline-none resize-none font-medium"
                                    />
                                    <button className="mt-6 w-full py-4 bg-primary-600 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em]">
                                        SAVE CLIENT RECORDS
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-grow bg-gray-900 rounded-[2rem] p-8 border border-white/5 flex flex-col">
                                    <h3 className="text-white font-black mb-6 text-xs uppercase tracking-[0.2em]">Client Journal</h3>
                                    <textarea
                                        placeholder="Note down thoughts or feelings during your session..."
                                        className="flex-grow bg-black/40 border border-white/10 rounded-2xl p-6 text-gray-300 text-sm focus:border-primary-500/50 outline-none resize-none font-medium"
                                    />
                                    <p className="mt-4 text-[9px] text-gray-600 uppercase font-black text-center">Your notes are private and not shared</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
