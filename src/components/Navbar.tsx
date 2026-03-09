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
                    <div className="flex items-center gap-2 max-w-[70%]">
                        <div className="w-8 h-8 md:w-10 md:h-10 premium-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg flex-shrink-0">H</div>
                        <span className={`text-sm md:text-xl font-bold tracking-tight truncate ${scrolled ? "text-gray-900" : "text-white"}`}>
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
                        className={`md:hidden p-3 rounded-xl transition-all ${scrolled
                            ? "text-gray-900 bg-gray-100"
                            : "text-white bg-white/10 backdrop-blur-md border border-white/20"
                            }`}
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-primary-950/95 backdrop-blur-2xl z-[200] overflow-hidden"
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#698465]/10 rounded-full blur-[120px]" />

                        <div className="container mx-auto px-6 h-full flex flex-col relative z-10">
                            {/* Mobile Menu Header */}
                            <div className="flex justify-between items-center py-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">H</div>
                                    <span className="text-xl font-bold tracking-tight text-white uppercase">
                                        Hope <span className="font-light text-primary-500">Services</span>
                                    </span>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Menu Links */}
                            <div className="flex-grow flex flex-col justify-center items-center gap-12 text-center">
                                {[
                                    { label: "Our Services", href: "/#services" },
                                    { label: "Our Approach", href: "/approach" },
                                ].map((link, i) => (
                                    <motion.a
                                        key={link.label}
                                        href={link.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 + 0.2 }}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-4xl font-black text-white hover:text-primary-400 transition-colors uppercase tracking-tight"
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-8"
                                >
                                    <a
                                        href="/#book"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-12 py-6 bg-primary-600 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary-500/40 inline-block"
                                    >
                                        Book Your Session
                                    </a>
                                </motion.div>
                            </div>

                            {/* Footer inside menu */}
                            <div className="py-12 border-t border-white/10 text-center">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">
                                    Guided by Excellence in Thika
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
