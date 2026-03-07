"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Layer: Cleaner presentation of ma.jpeg */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/ma.jpeg')",
                    }}
                />
                {/* Deep atmosphere overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/20 to-gray-900/90 backdrop-blur-[1px]"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
                        Hope <span className="text-primary-400 drop-shadow-[0_0_20px_rgba(72,168,184,0.6)]">Counseling</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Expert psychological support for your journey to mental wellness and inner peace.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <motion.a
                            href="#book"
                            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(45,137,153,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold transition-all shadow-2xl text-lg uppercase tracking-widest"
                        >
                            Start Your Journey
                        </motion.a>
                        <motion.a
                            href="#services"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 bg-white/5 hover:bg-white/15 text-white rounded-full font-bold transition-all backdrop-blur-xl border border-white/20 text-lg uppercase tracking-widest"
                        >
                            Our Services
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Modern scroll hint */}
            <motion.div
                className="absolute bottom-12 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                <div className="w-[1px] h-20 bg-gradient-to-b from-primary-400/80 to-transparent relative overflow-hidden">
                    <motion.div
                        animate={{ y: [0, 80] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-1/2 bg-white"
                    />
                </div>
            </motion.div>
        </section>
    );
}
