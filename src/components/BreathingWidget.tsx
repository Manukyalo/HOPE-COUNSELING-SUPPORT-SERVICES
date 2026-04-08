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
    <div className="flex flex-col items-center justify-center p-6 bg-blue-50/50 backdrop-blur-md rounded-2xl border border-blue-100 shadow-sm my-4">
      <p className="text-sm font-medium text-blue-800 mb-6 text-center max-w-[250px] leading-relaxed">
        {message}
      </p>
      
      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        {/* Outer glowing ring */}
        <motion.div
          animate={{
            scale: phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1,
            opacity: phase === "inhale" ? 0.3 : phase === "hold" ? 0.4 : 0.1,
          }}
          transition={{
            duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : 8,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-blue-400 rounded-full blur-xl"
        />
        
        {/* Inner solid circle */}
        <motion.div
          animate={{
            scale: phase === "inhale" ? 1.2 : phase === "hold" ? 1.2 : 0.8,
            backgroundColor: phase === "hold" ? "#93c5fd" : "#bfdbfe" 
          }}
          transition={{
            duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : 8,
            ease: "easeInOut",
          }}
          className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-inner"
        >
          <span className="text-blue-900 font-medium text-sm drop-shadow-sm">
            {text}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
