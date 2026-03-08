"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ApproachPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden pt-20 bg-primary-950">
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image
                        src="/ma.jpeg"
                        alt="Our Approach"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Methodology</span>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                            Our Team's <span className="text-primary-500">Approach</span>
                        </h1>
                        <div className="w-24 h-2 bg-primary-500 mx-auto rounded-full"></div>
                    </motion.div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Empathy-First Counseling</h2>
                                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                    Our approach begins with a deep, non-judgmental understanding of your unique lived experience. We prioritize building a safe, trusting connection where you feel truly heard.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-xl">
                                    <h4 className="text-primary-600 font-black uppercase tracking-widest text-xs mb-4">Science-Driven</h4>
                                    <p className="text-sm text-gray-700 font-bold leading-relaxed">
                                        We utilize evidence-based modalities like CBT, DBT, and mindfulness to ensure your progress is measurable and sustainable.
                                    </p>
                                </div>
                                <div className="p-8 bg-primary-900 rounded-[3rem] text-white shadow-2xl">
                                    <h4 className="text-primary-300 font-black uppercase tracking-widest text-xs mb-4">Client-Centered</h4>
                                    <p className="text-sm font-bold leading-relaxed">
                                        You are the expert of your life. We act as guides, empowering you to make decisions that align with your core values.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                                <Image
                                    src="https://images.unsplash.com/photo-1516534775068-ba3e84529ec1?auto=format&fit=crop&q=80&w=800"
                                    alt="Collaboration"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-60 z-0"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Process */}
            <section className="py-24 bg-gray-950 text-white overflow-hidden">
                <div className="container mx-auto px-4 max-w-5xl text-center mb-20">
                    <span className="text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">The Journey</span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8">How We Work <span className="text-primary-500">Together</span></h2>
                </div>

                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
                    {[
                        { step: "01", title: "Discovery", desc: "A free initial consultation to understand your needs and see if our expertise aligns with your goals." },
                        { step: "02", title: "Strategic Plan", desc: "Collaboratively developing a roadmap tailored to your specific mental wellness objectives." },
                        { step: "03", title: "Ongoing Support", desc: "Regular weekly or bi-weekly sessions focused on skill-building, processing, and growth." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            className="p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm relative group hover:bg-white/10 transition-all"
                        >
                            <span className="text-6xl font-black text-primary-500/20 absolute -top-4 -left-4 group-hover:text-primary-500/40 transition-colors uppercase tracking-widest">{item.step}</span>
                            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight relative z-10">{item.title}</h3>
                            <p className="text-gray-400 font-bold leading-relaxed relative z-10">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-primary-600 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12">
                        Ready to start your <br />
                        <span className="text-primary-200">Personal Growth?</span>
                    </h2>
                    <Link
                        href="/#book"
                        className="px-16 py-6 bg-white text-primary-900 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-100 transition-all shadow-2xl inline-block"
                    >
                        Book Your Session
                    </Link>
                </div>
            </section>
        </main>
    );
}
