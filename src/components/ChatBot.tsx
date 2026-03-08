"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect, useRef } from "react";
import { Send, User, Bot, X, MessageCircle, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

// Initialize the Gemini AI client
// NOTE: Using the environment variable as per user suggestion
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const SYSTEM_INSTRUCTION = `You are a warm, empathetic, and professional AI assistant for a counseling psychology website. Your goal is to provide a safe, non-judgmental space for users to express themselves.
- Converse naturally, like a compassionate human listener. Avoid sounding robotic, overly formal, or like you are reading from a script.
- Validate the user's feelings and show genuine care.
- Do not provide medical diagnoses, prescribe medication, or act as a replacement for professional therapy.
- If a user expresses thoughts of self-harm or is in immediate danger, gently but firmly encourage them to contact emergency services or a crisis hotline immediately.
- Keep your responses concise and conversational. Ask open-ended questions to encourage them to share more if they feel comfortable.
- You can help guide them to resources on the counseling website if appropriate (e.g., booking an appointment, reading articles).`;

type Message = {
    id: string;
    role: "user" | "model";
    text: string;
    isError?: boolean;
};

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "model",
            text: "Hello. I'm here to listen and support you. How are you feeling today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Store the chat instance in a ref so it persists across renders
    const chatRef = useRef<any>(null);

    useEffect(() => {
        if (!chatRef.current) {
            chatRef.current = genAI.getGenerativeModel({
                model: "gemini-pro",
                systemInstruction: SYSTEM_INSTRUCTION
            }).startChat({
                history: [],
                generationConfig: {
                    temperature: 0.7,
                },
            });
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            text: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const result = await chatRef.current.sendMessageStream(userMessage.text);

            let fullResponse = "";
            const modelMessageId = (Date.now() + 1).toString();

            setMessages((prev) => [
                ...prev,
                { id: modelMessageId, role: "model", text: "" },
            ]);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                    fullResponse += chunkText;
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === modelMessageId ? { ...msg, text: fullResponse } : msg
                        )
                    );
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "model",
                    text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                    isError: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-8 right-8 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-50 flex items-center justify-center"
                        aria-label="Open chat"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-8 right-8 w-[380px] h-[600px] max-h-[calc(100vh-64px)] max-w-[calc(100vw-64px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200"
                    >
                        {/* Header */}
                        <div className="bg-emerald-600 p-4 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg leading-tight">Amaya</h2>
                                    <p className="text-emerald-100 text-xs">Your Supportive Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-600"}`}>
                                            {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                        </div>
                                        <div
                                            className={`p-3 rounded-2xl ${msg.role === "user"
                                                ? "bg-emerald-600 text-white rounded-tr-sm"
                                                : msg.isError
                                                    ? "bg-red-50 text-red-600 border border-red-100 rounded-tl-sm"
                                                    : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-sm"
                                                }`}
                                        >
                                            {msg.isError && <AlertCircle className="w-4 h-4 mb-2 inline-block mr-1" />}
                                            <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "prose-invert" : "text-slate-800"}`}>
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex gap-2 max-w-[85%] flex-row">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-sm flex items-center gap-1">
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                            <div className="relative flex items-end gap-2">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    className="w-full max-h-32 min-h-[44px] bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 bottom-1.5 p-2 text-emerald-600 hover:bg-emerald-50 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                                    aria-label="Send message"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-slate-400">
                                    This is an AI assistant, not a replacement for professional therapy.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
