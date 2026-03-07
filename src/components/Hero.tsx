"use client";

import { motion } from "framer-motion";
import { ParallaxStars } from "./ParallaxStars";

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Layer: User Image + Parallax Stars */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] scale-105"
                    style={{
                        backgroundImage: "url('/ma.jpeg')",
                    }}
                >
                    {/* Parallax Stars overlaying the image for depth */}
                    <ParallaxStars speed={0.3} className="opacity-40" />
                </div>
                {/* Premium Overlay: Gradient and Blur */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-primary-950/40 to-gray-900/80 backdrop-blur-[2px]"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tight"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        Find Your Path to <span className="text-primary-300 drop-shadow-[0_0_15px_rgba(72,168,184,0.5)]">Inner Peace</span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                    >
                        Professional counseling services tailored to your journey. We provide a safe space for growth, healing, and discovery.
                    </motion.p>

                    <motion.div
                        className="flex flex-col md:flex-row gap-6 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <motion.a
                            href="#book"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(45,137,153,0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold transition-all shadow-xl shadow-primary-500/20 text-lg"
                        >
                            Book a Session
                        </motion.a>
                        <motion.a
                            href="#services"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all backdrop-blur-md border border-white/30 text-lg"
                        >
                            Explore Services
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative Interactive Element: Animated Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <span className="text-white/40 text-[10px] uppercase tracking-[4px] mb-2 font-bold">Discover</span>
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 bg-primary-400 rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
