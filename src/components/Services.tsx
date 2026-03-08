"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const services = [
    {
        slug: "individual-therapy",
        title: "Individual Therapy",
        icon: "🧘",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800",
        description: "One-on-one sessions tailored to your unique challenges and growth goals. Find your center in a supportive environment."
    },
    {
        slug: "marriage-counseling",
        title: "Marriage Counseling",
        icon: "💑",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e84529ec1?auto=format&fit=crop&q=80&w=800",
        description: "Strengthen your bond and resolve conflicts with professional guidance for couples specialized in relational growth."
    },
    {
        slug: "youth-support",
        title: "Youth Support",
        icon: "🎓",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
        description: "Specialized support for young people navigating the complexities of modern life, school, and identity."
    },
    {
        slug: "group-therapy",
        title: "Group Therapy",
        icon: "👪",
        image: "https://images.unsplash.com/photo-1529070535873-19672836279f?auto=format&fit=crop&q=80&w=800",
        description: "Shared healing experiences in a safe, moderated community environment."
    },
    {
        slug: "crisis-intervention",
        title: "Crisis Intervention",
        icon: "🆘",
        image: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&q=80&w=800",
        description: "Immediate support for those facing acute psychological distress or emergencies."
    },
    {
        slug: "stress-management",
        title: "Stress Management",
        icon: "🧘",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
        description: "Practical tools and techniques to handle daily pressure and find balance."
    },
];

export default function Services() {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Our Specialized Services</h2>
                    <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
                    <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
                        We offer a wide range of counseling services designed to support you through every stage of life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <Link key={index} href={`/services/${service.slug}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -15 }}
                                className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-xl transition-all duration-500 cursor-pointer h-full"
                            >
                                {/* Card Image */}
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                                    <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                                        {service.icon}
                                    </div>
                                </div>

                                <div className="p-10 -mt-10 relative z-10 bg-white rounded-t-[2.5rem]">
                                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center gap-3 text-primary-600 font-bold uppercase tracking-widest text-xs">
                                        View Details <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
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
