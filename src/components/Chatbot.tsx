"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi there, I'm Amaya. I'm here to make things easier for you—whether that's finding the right counselor, booking a session, or just offering some gentle support. How can I best help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsTyping(true);

        // Simulate AI response logic
        setTimeout(() => {
            let aiResponse = "";
            const lowerMsg = userMessage.toLowerCase();

            if (lowerMsg.includes("book") || lowerMsg.includes("session") || lowerMsg.includes("schedule")) {
                aiResponse = "I'd be happy to help you get that scheduled. The easiest way is through our booking section further down this page. I can walk you through the date and time options if you'd like, or we can just jump straight there. What sounds best?";
            } else if (lowerMsg.includes("anxiety") || lowerMsg.includes("feel") || lowerMsg.includes("stress")) {
                aiResponse = "I hear you, and it's completely okay to feel that way. It takes a lot of strength just to say it out loud. While I'm here for administrative support, our specialists are wonderful at helping navigate those heavy feelings. Would you like to see who's available for a chat?";
            } else if (lowerMsg.includes("contact") || lowerMsg.includes("call") || lowerMsg.includes("email")) {
                aiResponse = "Of course. You can reach the team directly at amayakari5924@gmail.com or give us a call at 0701279231. We're based right here in Thika, and there's a WhatsApp button at the bottom of the page if you prefer a quick message!";
            } else {
                aiResponse = "I truly appreciate you sharing that with me. I'm looking into how we can best support you with this. Sometimes a quiet, dedicated session is the best place to explore things further. Would you like to know more about our individual therapy sessions?";
            }

            setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[9999]">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 md:w-16 md:h-16 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl md:text-3xl shadow-primary-600/40 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full" />
                    {isOpen ? "✕" : "💬"}
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 md:bottom-32 md:right-10 w-[min(calc(100vw-3rem),400px)] h-[min(600px,calc(100vh-10rem))] bg-white rounded-[2rem] shadow-2xl z-[9999] border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary-900 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-xl">✨</div>
                                <div>
                                    <h3 className="font-bold">Amaya Assistant</h3>
                                    <p className="text-[10px] text-primary-300 uppercase tracking-widest font-bold">Online • Support Bot</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user"
                                        ? "bg-primary-600 text-white rounded-tr-none shadow-lg shadow-primary-600/10"
                                        : "bg-gray-100 text-gray-800 rounded-tl-none font-medium"
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t border-gray-100 flex gap-3 items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="How can I support you right now?"
                                className="flex-grow bg-gray-100 border-none rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors"
                            >
                                ➔
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
