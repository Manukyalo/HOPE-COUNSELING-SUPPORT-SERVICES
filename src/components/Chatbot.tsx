"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm your Hope Counseling assistant. How can I support you today? (I can help you book a session or answer mental health questions)" }
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
                aiResponse = "I can definitely help with that! You can use our booking section right here on the home page. Just accept the consent form and choose a time that works for you. Would you like me to guide you there?";
            } else if (lowerMsg.includes("anxiety") || lowerMsg.includes("feel") || lowerMsg.includes("stress")) {
                aiResponse = "I'm sorry to hear you're feeling that way. It takes courage to reach out. While I'm an AI assistant, our professional counselors are here to help. Taking a deep breath can sometimes help in the moment. Would you like to see our available specialties?";
            } else if (lowerMsg.includes("contact") || lowerMsg.includes("call") || lowerMsg.includes("email")) {
                aiResponse = "You can reach us directly at amayakari5924@gmail.com or call 0701279231. We are based in Thika and also have a WhatsApp button at the bottom of the page!";
            } else {
                aiResponse = "I understand. I'm searching for information related to your query... It seems like a complex situation. Our counseling sessions are designed exactly for these kinds of discussions. The first step is often the hardest, and we are here to support you.";
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
                                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">🤖</div>
                                <div>
                                    <h3 className="font-bold">Hope Assistant</h3>
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
                                        : "bg-gray-100 text-gray-700 rounded-tl-none"
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
                                placeholder="How can I help you book?"
                                className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
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
