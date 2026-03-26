"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[8000] md:hidden px-4 pb-4"
        >
          <Link 
            href="/#book"
            className="w-full h-[56px] bg-[#0d2b22] text-[#7ecab0] rounded-full flex items-center justify-center font-sans font-medium text-[13px] uppercase tracking-widest shadow-2xl border border-white/10"
          >
            Book a Free Session
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
