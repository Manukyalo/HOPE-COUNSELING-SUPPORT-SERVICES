"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Service {
    title: string;
    image: string;
    description: string;
    longContent: string[];
    benefits: string[];
}

export default function ServiceDetailContent({ service }: { service: Service }) {
    return (
        <motion.main
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white"
        >
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">
                            {service.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="md:col-span-2 space-y-10">
                            {service.longContent.map((paragraph, i) => (
                                <p key={i} className="text-xl text-gray-600 leading-relaxed font-medium">
                                    {paragraph}
                                </p>
                            ))}

                            <div className="pt-12">
                                <Link
                                    href="/#book"
                                    className="px-12 py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-900 transition-all shadow-2xl shadow-primary-600/20 inline-block"
                                >
                                    Book This Session
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-xl">
                                <h4 className="text-primary-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Key Benefits</h4>
                                <ul className="space-y-6">
                                    {service.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-4 text-gray-700 font-bold text-sm leading-tight">
                                            <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0"></span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-primary-900 p-10 rounded-[3rem] text-white shadow-2xl">
                                <h4 className="text-primary-300 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Duration</h4>
                                <p className="text-3xl font-black">45 Minutes</p>
                                <p className="text-[10px] text-primary-400 mt-4 font-black uppercase tracking-widest">Standard Session Length</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </motion.main>
    );
}
