"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const servicesDetails: Record<string, any> = {
    "individual-therapy": {
        title: "Individual Therapy",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1000",
        description: "One-on-one sessions tailored to your unique personal challenges and growth goals. We focus on building resilience and self-awareness.",
        longContent: [
            "Individual therapy is a collaborative process between a therapist and a person in therapy. Common goals of treatment can be to inspire change or improve quality of life.",
            "People may seek therapy for help with issues that are hard to face alone. Individual therapy is also called therapy, psychotherapy, psychosocial therapy, talk therapy, and counseling.",
            "Therapy can help people overcome obstacles to their well-being. It can increase positive feelings, such as compassion and self-esteem. People in therapy can learn skills for handling difficult situations, making healthy decisions, and reaching goals."
        ],
        benefits: ["Personalized growth", "Emotional resilience", "Processing trauma", "Goal setting"]
    },
    "marriage-counseling": {
        title: "Marriage & Relationship Counseling",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e84529ec1?auto=format&fit=crop&q=80&w=1000",
        description: "Strengthen your bond and resolve conflicts with professional guidance for couples at any stage of their relationship.",
        longContent: [
            "Relationship counseling can help you and your partner work through issues and strengthen your bond. It's not just for couples in crisis; it's a valuable tool for anyone looking to improve their connection.",
            "We provide a neutral space where both partners can express themselves honestly and learn effective communication techniques.",
            "Whether you're dealing with communication breakdowns, trust issues, or just want to grow closer, our therapists are here to support your relationship's health."
        ],
        benefits: ["Improved communication", "Conflict resolution", "Rebuilding trust", "Deepening intimacy"]
    },
    "youth-support": {
        title: "Youth & Adolescent Support",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000",
        description: "Specialized support for young people navigating the complexities of modern life, school, and transitions.",
        longContent: [
            "Adolescence is a time of major change—physical, emotional, and social. Our youth support services are designed to help young people navigate these transitions with confidence.",
            "We offer a safe, non-judgmental environment where teens can talk about school stress, peer relationships, identity, and mental health.",
            "Our goal is to empower the next generation with the emotional tools they need to thrive."
        ],
        benefits: ["Academic support", "Social skill building", "Emotional regulation", "Identity exploration"]
    }
};

export default function ServicePage({ params }: { params: { slug: string } }) {
    const service = servicesDetails[params.slug];

    if (!service) {
        notFound();
    }

    return (
        <motion.main
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white"
        >
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">
                            {service.title}
                        </h1>
                        <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-8">
                            {service.longContent.map((paragraph: string, i: number) => (
                                <p key={i} className="text-lg text-gray-600 leading-relaxed italic last:not-italic">
                                    {paragraph}
                                </p>
                            ))}

                            <div className="pt-12">
                                <Link
                                    href="/#book"
                                    className="px-10 py-5 bg-primary-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-primary-600 transition-colors inline-block"
                                >
                                    Book This Session
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-primary-50 p-8 rounded-3xl border border-primary-100">
                                <h4 className="text-primary-900 font-bold uppercase tracking-widest text-xs mb-6">Key Benefits</h4>
                                <ul className="space-y-4">
                                    {service.benefits.map((benefit: string, i: number) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-sage-50 p-8 rounded-3xl border border-sage-100">
                                <h4 className="text-sage-900 font-bold uppercase tracking-widest text-xs mb-4">Duration</h4>
                                <p className="text-2xl font-black text-sage-900">45 Minutes</p>
                                <p className="text-xs text-sage-600 mt-2 font-bold uppercase tracking-tighter">Standard Session Length</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </motion.main>
    );
}
