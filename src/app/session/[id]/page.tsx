"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function LiveSession() {
    const params = useParams();
    const sessionId = params.id as string;
    const [jitsiLoaded, setJitsiLoaded] = useState(false);

    useEffect(() => {
        // In a real app, we would load the Jitsi Meet External API script here
        // For this demo, we'll show a premium interface that links to the meeting
        setJitsiLoaded(true);
    }, []);

    const jitsiUrl = `https://meet.jit.si/HopeCounseling_${sessionId}`;

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Video Area (Placeholder for Iframe) */}
                    <div className="flex-grow aspect-video bg-black rounded-3xl overflow-hidden relative border border-gray-800 shadow-2xl">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-4xl mb-6 animate-pulse">
                                📹
                            </div>
                            <h1 className="text-3xl font-bold mb-4">Live Session: {sessionId}</h1>
                            <p className="text-gray-400 mb-8 max-w-md">Your secure video channel is ready. Click the button below to join the counselor.</p>
                            <a
                                href={jitsiUrl}
                                target="_blank"
                                className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold transition-all shadow-lg shadow-primary-600/30"
                            >
                                Join Video Call Now
                            </a>
                        </div>

                        {/* Control Bar Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-800/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                            <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full">🎙️</button>
                            <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full">📷</button>
                            <button className="p-3 bg-primary-600 hover:bg-primary-700 rounded-full">💻</button>
                            <button className="p-3 bg-red-600 hover:bg-red-700 rounded-full ml-4">📞</button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Session Info</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Client</p>
                                    <p className="font-medium">John Doe</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Type</p>
                                    <p className="font-medium text-primary-400">Individual Therapy</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Session ID</p>
                                    <p className="font-mono text-sm opacity-60">{sessionId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Chat</h2>
                            <div className="h-48 flex flex-col justify-end text-sm text-gray-400 italic">
                                No messages yet. Start the conversation!
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
