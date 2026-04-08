"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BreathingWidget({ message }: { message: string }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [text, setText] = useState("Inhale...");

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const cycle = () => {
      setPhase("inhale");
      setText("Breathe in...");
      timeout = setTimeout(() => {
        setPhase("hold");
        setText("Hold...");
        timeout = setTimeout(() => {
          setPhase("exhale");
          setText("Breathe out slowly...");
          timeout = setTimeout(cycle, 8000); // Exhale 8s
        }, 7000); // Hold 7s
      }, 4000); // Inhale 4s
    };

    cycle();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-xl rounded-3xl border border-[#7ecab0]/20 shadow-xl my-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7ecab0]/30 to-transparent" />
      
      <p className="text-sm font-instrument italic text-[#0d2b22] mb-8 text-center max-w-[250px] leading-relaxed">
        {message}
      </p>
      
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        {/* Pulsing Aura */}
        <motion.div
          animate={{
            scale: phase === "inhale" ? 1.6 : phase === "hold" ? 1.6 : 1,
            opacity: phase === "inhale" ? 0.2 : phase === "hold" ? 0.3 : 0.05,
          }}
          transition={{
            duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : 8,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-[#7ecab0] rounded-full blur-2xl"
        />
        
        {/* Secondary Circle for depth */}
        <motion.div
          animate={{
            scale: phase === "inhale" ? 1.3 : phase === "hold" ? 1.3 : 0.9,
            opacity: 0.1
          }}
          transition={{
            duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : 8,
            ease: "circOut",
          }}
          className="absolute w-32 h-32 rounded-full border-2 border-[#0d2b22]"
        />

        {/* Main Breathing Circle */}
        <motion.div
          animate={{
            scale: phase === "inhale" ? 1.2 : phase === "hold" ? 1.2 : 0.8,
            backgroundColor: phase === "hold" ? "#7ecab0" : "#a8e6cf",
            boxShadow: phase === "hold" ? "0 0 40px rgba(126, 202, 176, 0.4)" : "0 0 0px rgba(0,0,0,0)"
          }}
          transition={{
            duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : 8,
            ease: "easeInOut",
          }}
          className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center shadow-inner border border-white/20"
        >
          <motion.span 
            key={text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#0d2b22] font-bold text-xs uppercase tracking-widest text-center px-4"
          >
            {text}
          </motion.span>
        </motion.div>
      </div>

      <div className="flex space-x-1 mt-2">
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${phase === 'inhale' ? 'bg-[#7ecab0]' : 'bg-neutral-200'}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${phase === 'hold' ? 'bg-[#7ecab0]' : 'bg-neutral-200'}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${phase === 'exhale' ? 'bg-[#7ecab0]' : 'bg-neutral-200'}`} />
      </div>
    </div>
  );
}
