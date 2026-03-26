"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] flex items-center justify-end group">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block mr-3 px-3.5 py-1.5 bg-[#0d2b22] text-white text-[12px] font-sans font-medium rounded-full shadow-lg"
          >
            Chat with us
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <a
        href="https://wa.me/254701279231?text=Hello%2C%20I%27d%20like%20to%20learn%20more%20about%20Hope%20Counseling%20services."
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-[50px] h-[50px] md:w-[56px] md:h-[56px] bg-[#25D366] rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale(1.08) hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] animate-pulse-ring"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-[28px] h-[28px]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.87 9.87 0 01-5.031-1.373l-.36-.214-3.733.889.936-3.617-.235-.373A9.859 9.859 0 012.118 12 9.882 9.882 0 0112 2.118 9.882 9.882 0 0121.882 12 9.882 9.882 0 0112 21.882z"/>
        </svg>
      </a>
    </div>
  );
}
