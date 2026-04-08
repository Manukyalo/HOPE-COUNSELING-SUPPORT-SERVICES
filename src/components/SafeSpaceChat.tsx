"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Heart, AlertCircle, Phone } from "lucide-react";
import BreathingWidget from "./BreathingWidget";

export default function SafeSpaceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, status, sendMessage } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    // @ts-ignore - Ignore type error if SDK demands different payload
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
    setInput('');
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[140px] right-[16px] md:bottom-[100px] md:right-[28px] w-14 h-14 bg-[#0d2b22] hover:bg-[#1a4a38] text-white rounded-full shadow-[0_8px_30px_rgba(13,43,34,0.3)] flex items-center justify-center z-50 transition-colors border border-[#7ecab0]/20"
          >
            <Heart className="w-6 h-6 fill-[#7ecab0]/20" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-[140px] right-[16px] md:bottom-[100px] md:right-[28px] w-[380px] h-[600px] max-h-[80vh] bg-[#f9f7f4]/95 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-16px_rgba(13,43,34,0.2)] flex flex-col z-50 overflow-hidden border border-[#7ecab0]/30"
          >
            {/* Header */}
            <div className="bg-[#0d2b22] px-6 py-4 border-b border-[#7ecab0]/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#1a4a38] shadow-sm flex items-center justify-center text-[#7ecab0]">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-instrument italic text-[#f9f7f4] text-lg leading-none">Safe Space</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#7ecab0] font-medium mt-1">Concierge</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-[#f9f7f4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <motion.div 
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa]/50"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                  <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center">
                    <Heart className="w-8 h-8 text-[#7ecab0] fill-[#7ecab0]/10" />
                  </div>
                  <div>
                    <p className="font-instrument italic text-[#0d2b22] text-xl">Peace be with you.</p>
                    <p className="text-sm text-neutral-500 max-w-[200px] mt-2">
                      This is a safe space. How are you feeling today?
                    </p>
                  </div>
                </div>
              )}
              
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div key={message.id} className="flex flex-col">
                    {/* Parts processing for Vercel AI SDK 6.0 */}
                    {message.parts?.map((part: any, index: number) => {
                      if (part.type === 'text') {
                        return (
                          <motion.div
                            key={index}
                            variants={{
                              hidden: { opacity: 0, y: 10, scale: 0.95 },
                              visible: { opacity: 1, y: 0, scale: 1 }
                            }}
                            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
                          >
                            <div
                              className={`max-w-[85%] rounded-[1.25rem] px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
                                isUser
                                  ? "bg-[#1a4a38] text-[#f9f7f4] rounded-br-[0.25rem]"
                                  : "bg-white border border-[#7ecab0]/10 text-[#0d2b22] rounded-bl-[0.25rem]"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{part.text}</p>
                            </div>
                          </motion.div>
                        );
                      }

                      // Tool: Breathing Widget
                      if (part.type === 'tool-triggerBreathingExercise') {
                        if (!part.output) {
                          return (
                            <div key={index} className="flex justify-start mb-2">
                              <div className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs text-neutral-400 animate-pulse">
                                Processing...
                              </div>
                            </div>
                          );
                        }
                        return <BreathingWidget key={index} message={part.output.message} />;
                      }

                      // Tool: Service Suggestion
                      if (part.type === 'tool-suggestService') {
                        if (!part.output) {
                           return (
                             <div key={index} className="flex justify-start mb-2">
                               <div className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs text-neutral-400 animate-pulse">
                                 Looking up services...
                               </div>
                             </div>
                           );
                        }
                        return (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-[#7ecab0]/30 shadow-md rounded-2xl p-5 mb-6 overflow-hidden relative"
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#7ecab0]" />
                            <h4 className="text-[#0d2b22] font-semibold mb-2 text-base font-instrument italic">Recommended Service</h4>
                            <p className="text-[#1a4a38] font-bold text-sm mb-2 uppercase tracking-wide">{part.output.service}</p>
                            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                              {part.output.reason}
                            </p>
                            <button className="text-xs bg-[#f9f7f4] text-[#0d2b22] px-4 py-2 rounded-full font-bold border border-[#0d2b22]/10 hover:bg-[#0d2b22] hover:text-white transition-all">
                              View Service Details &rarr;
                            </button>
                          </motion.div>
                        );
                      }

                      // Tool: Emergency Protocol
                      if (part.type === 'tool-triggerEmergencyProtocol') {
                         if (!part.output) return null;
                         return (
                           <div key={index} className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-4">
                             <div className="flex items-center space-x-2 text-rose-700 font-semibold mb-3">
                               <AlertCircle className="w-5 h-5" />
                               <span className="text-sm">You are not alone.</span>
                             </div>
                             <p className="text-xs text-rose-800/80 mb-4 leading-relaxed">
                               {part.output.reason} Please reach out immediately to professionals who can support you.
                             </p>
                             <div className="space-y-2">
                               <a href="tel:988" className="flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-2.5 transition-colors">
                                 <Phone className="w-4 h-4" />
                                 <span className="text-sm font-medium">Call 988 Crisis Lifeline</span>
                               </a>
                               <a href="sms:741741" className="flex items-center justify-center space-x-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg py-2.5 transition-colors">
                                 <MessageCircle className="w-4 h-4" />
                                 <span className="text-sm font-medium">Text HOME to 741741</span>
                               </a>
                             </div>
                           </div>
                         );
                      }

                      return null;
                    })}
                  </div>
                );
              })}
              
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#7ecab0]/10 shadow-sm rounded-[1.25rem] rounded-bl-[0.25rem] px-5 py-3.5 flex space-x-1.5 h-11 items-center">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 bg-[#7ecab0] rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-[#7ecab0] rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-[#7ecab0] rounded-full" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </motion.div>

            {/* Input Form */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-[#7ecab0]/10">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="How can we support you today?"
                  className="w-full bg-[#f9f7f4] border border-[#7ecab0]/20 rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ecab0]/20 focus:border-[#7ecab0]/50 transition-all text-[#0d2b22] font-sans placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 w-10 h-10 bg-[#0d2b22] hover:bg-[#1a4a38] disabled:bg-neutral-100 disabled:text-neutral-300 text-white rounded-full flex items-center justify-center transition-all shadow-sm"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
