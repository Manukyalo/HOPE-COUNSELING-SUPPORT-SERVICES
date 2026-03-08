"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function About() {
    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary-600 font-bold uppercase tracking-[0.4em] text-xs">About Us</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-6 mb-8 leading-tight uppercase tracking-tight">
                            Guided by Compassion, <br />
                            <span className="text-primary-500 italic">Rooted in Excellence.</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full mb-10"></div>
                        <p className="text-xl text-gray-500 leading-relaxed mb-12 font-medium max-w-3xl mx-auto">
                            Hope Counseling Support Services provides a sanctuary for mental healing and personal growth. Based in Thika, we offer professional psychological support tailored to your unique journey.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-left"
                    >
                        <h3 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">Our Philosophy</h3>
                        <p className="text-gray-500 leading-relaxed mb-10 text-lg font-medium">
                            We believe that every individual possesses the innate strength to overcome life's most difficult challenges. Our role is to provide the professional guidance and safe environment necessary to unlock that potential.
                        </p>

                        <div className="grid grid-cols-1 gap-10 mb-12">
                            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-xl">
                                <h4 className="text-4xl font-black text-primary-600 mb-2">10+</h4>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest uppercase">Expertise Fields in Psychology</p>
                            </div>
                        </div>

                        <Link
                            href="/approach"
                            className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-sm hover:bg-primary-600 transition-all shadow-xl inline-block"
                        >
                            Our Team Approach
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative z-10 border-8 border-white">
                            <Image
                                src="/ma.jpeg"
                                alt="Hope Counseling Support Services"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-100 rounded-full blur-3xl opacity-60 z-0"></div>
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sage-100 rounded-full blur-3xl opacity-60 z-0"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
