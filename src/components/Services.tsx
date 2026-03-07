"use client";

import { motion } from "framer-motion";

const services = [
    {
        title: "Individual Therapy",
        description: "Personalized one-on-one sessions focused on your specific needs and personal growth.",
        icon: "👤",
    },
    {
        title: "Marriage Counseling",
        description: "Strengthening relationships and communication between partners through guided support.",
        icon: "🤝",
    },
    {
        title: "Youth Support",
        description: "Specialized counseling for children and adolescents navigating life's challenges.",
        icon: "🌱",
    },
    {
        title: "Group Therapy",
        description: "Shared healing experiences in a safe, moderated community environment.",
        icon: "👪",
    },
    {
        title: "Crisis Intervention",
        description: "Immediate support for those facing acute psychological distress or emergencies.",
        icon: "🆘",
    },
    {
        title: "Stress Management",
        description: "Practical tools and techniques to handle daily pressure and find balance.",
        icon: "🧘",
    },
];

export default function Services() {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Specialized Services</h2>
                    <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
                    <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
                        We offer a wide range of counseling services designed to support you through every stage of life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                            className="p-8 rounded-2xl bg-primary-50 border border-primary-100 transition-all duration-300 group cursor-default"
                        >
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 block w-fit">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                            <button className="mt-6 text-primary-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                Learn More <span>→</span>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
