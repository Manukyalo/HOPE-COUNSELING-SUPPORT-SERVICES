"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[#0d2b22]/90 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-[#0d2b22] py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="font-playfair text-xl md:text-2xl text-[#f5f2ec] tracking-tight">
              Hope <span className="text-[#7ecab0]">Counseling</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <Link
                href="/#services"
                className="font-sans text-[11px] uppercase tracking-[0.05em] text-[#f5f2ec]/60 transition-colors hover:text-[#7ecab0]"
              >
                Services
              </Link>
              <Link
                href="/approach"
                className="font-sans text-[11px] uppercase tracking-[0.05em] text-[#f5f2ec]/60 transition-colors hover:text-[#7ecab0]"
              >
                Our Approach
              </Link>
              <Link
                href="/contact"
                className="font-sans text-[11px] uppercase tracking-[0.05em] text-[#f5f2ec]/60 transition-colors hover:text-[#7ecab0]"
              >
                Contact
              </Link>
            </div>
            <Link
              href="/#book"
              className="px-6 py-2.5 bg-[#7ecab0] hover:bg-[#a8e6cf] text-[#0d2b22] rounded-[30px] font-sans font-medium text-[12px] transition-all"
            >
              Book a Session
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#f5f2ec]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#0d2b22] z-[200] flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
              <span className="font-playfair text-xl text-[#f5f2ec]">
                Hope <span className="text-[#7ecab0]">Counseling</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#f5f2ec]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center gap-10">
              <Link
                href="/#services"
                onClick={() => setMobileMenuOpen(false)}
                className="font-playfair text-3xl text-[#f5f2ec]"
              >
                Services
              </Link>
              <Link
                href="/approach"
                onClick={() => setMobileMenuOpen(false)}
                className="font-playfair text-3xl text-[#f5f2ec]"
              >
                Our Approach
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="font-playfair text-3xl text-[#f5f2ec]"
              >
                Contact
              </Link>
              <Link
                href="/#book"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-10 py-4 bg-[#7ecab0] text-[#0d2b22] rounded-[30px] font-sans font-medium text-lg"
              >
                Book a Session
              </Link>
            </div>

            <div className="p-10 text-center border-t border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f5f2ec]/40 font-sans">
                Thika, Kenya · Since 2024
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
