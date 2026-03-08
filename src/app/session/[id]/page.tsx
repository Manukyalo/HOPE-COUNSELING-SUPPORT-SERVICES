"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = 'force-dynamic';

export default function LiveSession({ params }: { params: { id: string } }) {
    const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const roomName = `HopeCounseling_${params.id}`;

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
                        <h1 className="text-white font-bold tracking-tight">Session Room: {params.id}</h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">Secure & Encrypted</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-5 py-2.5 bg-red-600/10 text-red-400 border border-red-600/20 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">
                        LEAVE SESSION
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
                            src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`}
                            className="w-full h-full border-none"
                            allow="camera; microphone; display-capture; autoplay; clipboard-write"
                        />
                    ) : permissionState === "denied" ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-4xl mb-6">!</div>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Hardware Access Denied</h2>
                            <p className="text-gray-400 max-w-sm mb-8">Please enable camera and microphone access in your browser settings to join the session.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all"
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
                            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Requesting Access</h2>
                            <p className="text-gray-500">Please click "Allow" when prompted by your browser.</p>
                        </div>
                    )}
                </motion.div>

                {/* Collapsible Info/Chat Area */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className="w-96 flex flex-col gap-4 flex-shrink-0"
                        >
                            <div className="bg-gray-900 rounded-[2rem] p-8 border border-white/5">
                                <h3 className="text-white font-black mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Live Participants
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black">C</div>
                                        <span className="text-gray-300 font-bold">Counselor (You)</span>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-30">
                                        <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-white font-black">U</div>
                                        <span className="text-gray-500 font-bold italic">Waiting for Client...</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow bg-gray-900 rounded-[2rem] p-8 border border-white/5 flex flex-col shadow-inner">
                                <h3 className="text-white font-black mb-6 text-xs uppercase tracking-[0.2em]">Digital Notebook</h3>
                                <textarea
                                    placeholder="Take private notes here during the session..."
                                    className="flex-grow bg-black/40 border border-white/10 rounded-2xl p-6 text-gray-300 text-sm focus:border-primary-500/50 outline-none resize-none font-medium leading-relaxed"
                                />
                                <button className="mt-6 w-full py-4 bg-primary-600 text-white font-black rounded-2xl shadow-lg shadow-primary-600/20 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-[0.2em]">
                                    SAVE PRIVATE NOTES
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
