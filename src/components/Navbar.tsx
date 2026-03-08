"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}>
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">H</div>
                        <span className={`text-xl font-bold tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
                            HOPE <span className="font-light text-primary-500">SERVICES</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="/#services" className={`font-bold uppercase tracking-widest text-[10px] transition-colors hover:text-primary-500 ${scrolled ? "text-gray-900" : "text-white"}`}>Services</a>
                        <a href="/approach" className={`font-bold uppercase tracking-widest text-[10px] transition-colors hover:text-primary-500 ${scrolled ? "text-gray-900" : "text-white"}`}>Our Approach</a>
                        <a
                            href="/#book"
                            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-primary-600/20"
                        >
                            Book Now
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className={`md:hidden p-2 ${scrolled ? "text-gray-900" : "text-white"}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
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
                        className="fixed inset-0 bg-primary-950 z-[200] flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">H</div>
                                <span className="text-xl font-bold tracking-tight text-white">
                                    HOPE <span className="font-light text-primary-500">SERVICES</span>
                                </span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-8">
                            <a href="/#services" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-white uppercase tracking-tighter">Services</a>
                            <a href="/approach" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-white uppercase tracking-tighter">Our Approach</a>
                            <a
                                href="/#book"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-8 px-10 py-5 bg-primary-500 text-white rounded-full font-black uppercase tracking-widest text-sm text-center shadow-2xl shadow-primary-500/40"
                            >
                                Book Now
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
