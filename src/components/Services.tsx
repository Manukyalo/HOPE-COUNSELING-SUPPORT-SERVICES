"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const services = [
    {
        slug: "stress-anxiety-management",
        title: "Stress and Anxiety management",
        image: "https://images.unsplash.com/photo-1474418397713-7dedd4d2b45a?auto=format&fit=crop&q=80&w=800",
        description: "Master tools to navigate life's pressures and find your internal calm using evidence-based techniques."
    },
    {
        slug: "relationship-counseling",
        title: "Relationship Counseling",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e84529ec1?auto=format&fit=crop&q=80&w=800",
        description: "Foster deeper connections and resolve conflicts through compassionate communication and expert guidance."
    },
    {
        slug: "youth-mentorship",
        title: "Youth mentorship and guidance",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
        description: "Empowering the next generation with the confidence and clarity needed to navigate modern adolescence."
    },
    {
        slug: "academic-guidance",
        title: "Academic guidance",
        image: "https://images.unsplash.com/photo-1434030216411-0bb7c3f3df44?auto=format&fit=crop&q=80&w=800",
        description: "Navigating educational pathways and overcoming learning challenges with strategic personal development."
    },
    {
        slug: "emotional-peer-support",
        title: "Emotional support and Peer Counseling",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
        description: "A safe, shared space for connection and mutual understanding led by experienced peer facilitators."
    },
];

export default function Services() {
    return (
        <section id="services" className="py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <span className="text-primary-600 font-bold uppercase tracking-[0.4em] text-xs">Our Expertise</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-6 uppercase tracking-tight">Our Specialized Services</h2>
                    <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
                    <p className="text-gray-500 mt-8 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        Professional, high-impact counseling tailored to your unique journey towards mental wellness.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {services.map((service, index) => (
                        <Link key={index} href={`/services/${service.slug}`}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -10 }}
                                className="group relative overflow-hidden rounded-[3rem] bg-white shadow-2xl transition-all duration-500 cursor-pointer h-full border border-gray-100/50"
                            >
                                {/* Card Image */}
                                <div className="h-72 overflow-hidden relative">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60"></div>
                                </div>

                                <div className="p-10 relative z-10 bg-white -mt-12 rounded-t-[3rem]">
                                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed mb-8 line-clamp-3 text-sm font-medium">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-primary-600 font-black uppercase tracking-widest text-xs">
                                        Learn More <span className="w-8 h-[2px] bg-primary-600 transition-all group-hover:w-12"></span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
