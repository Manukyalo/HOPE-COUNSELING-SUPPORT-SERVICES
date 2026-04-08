"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Heart, AlertCircle, Phone } from "lucide-react";
import BreathingWidget from "./BreathingWidget";

export default function SafeSpaceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat"
  });
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
            className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-[0_8px_30px_rgb(5,150,105,0.3)] flex items-center justify-center z-50 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
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
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-emerald-100/50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600">
                  <Heart className="w-4 h-4 fill-emerald-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 text-sm">Safe Space</h3>
                  <p className="text-xs text-emerald-600/70">Support & Resource Guide</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-100/50 text-emerald-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                  <Heart className="w-12 h-12 text-emerald-200" />
                  <p className="text-sm text-neutral-500 max-w-[200px]">
                    Hi there. This is a safe space. How are you feeling today?
                  </p>
                </div>
              )}
              
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div key={message.id} className="flex flex-col">
                    {/* The text message box */}
                    {message.content && (
                       <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              isUser
                                ? "bg-emerald-600 text-white rounded-br-sm"
                                : "bg-white border border-neutral-100 shadow-sm text-neutral-700 rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                      </motion.div>
                    )}

                    {/* Tool Invocations Array (Generative UI) */}
                    {message.toolInvocations?.map((toolInvocation: any) => {
                      const { toolName, toolCallId, state, args } = toolInvocation;

                      if (state !== 'result') {
                        return (
                           <div key={toolCallId} className="flex justify-start mb-2">
                             <div className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs text-neutral-400 animate-pulse">
                               Processing {toolName}...
                             </div>
                           </div>
                        );
                      }

                      const result = toolInvocation.result;

                      // Identify tool types and render beautiful UI
                      if (result?.ui === 'BREATHING_WIDGET') {
                        return <BreathingWidget key={toolCallId} message={result.message} />;
                      }

                      if (result?.ui === 'SERVICE_CARD') {
                        return (
                          <div key={toolCallId} className="bg-white border border-emerald-100/50 shadow-sm rounded-xl p-4 mb-4">
                            <h4 className="text-emerald-800 font-medium mb-1 text-sm">{result.service}</h4>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                              {result.reason}
                            </p>
                            <button className="mt-3 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium hover:bg-emerald-100 transition-colors">
                              Learn More &rarr;
                            </button>
                          </div>
                        );
                      }

                      if (result?.ui === 'EMERGENCY_MODAL') {
                        return (
                          <div key={toolCallId} className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-4">
                            <div className="flex items-center space-x-2 text-rose-700 font-semibold mb-3">
                              <AlertCircle className="w-5 h-5" />
                              <span className="text-sm">You are not alone.</span>
                            </div>
                            <p className="text-xs text-rose-800/80 mb-4 leading-relaxed">
                              {result.reason} Please reach out immediately to professionals who can support you.
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
                  <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex space-x-1.5 h-10 items-center">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-emerald-100/50">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-neutral-800 placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
