"use client";

import { motion } from "framer-motion";

export default function About() {
    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary-600 font-bold uppercase tracking-[0.3em] text-xs">About Us</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-8 leading-tight">
                            Guided by Compassion, <br />
                            <span className="text-primary-500">Rooted in Professionalism.</span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Hope Counseling Support Services was founded with a single mission: to provide a sanctuary for mental healing and personal growth. Based in Thika, we offer a blend of traditional therapeutic wisdom and modern, accessible technology to support our clients wherever they are.
                        </p>
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div>
                                <h4 className="text-3xl font-black text-primary-600">10+</h4>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Specialties</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-primary-600">500+</h4>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Sessions Held</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-primary-600 transition-colors"
                        >
                            Meet Our Team
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-4 border-white/20">
                            <img
                                src="/ma.jpeg"
                                alt="Hope Counseling Support Services"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-60 z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sage-100 rounded-full blur-3xl opacity-60 z-0"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
