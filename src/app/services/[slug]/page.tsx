"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const servicesDetails: Record<string, any> = {
    "stress-anxiety-management": {
        title: "Stress & Anxiety Management",
        image: "https://images.unsplash.com/photo-1474418397713-7dedd4d2b45a?auto=format&fit=crop&q=80&w=1000",
        description: "Master tools to navigate life's pressures and find your internal calm using evidence-based techniques.",
        longContent: [
            "In today's fast-paced world, stress and anxiety can often feel like constant companions. Our management program is designed to give you back the steering wheel.",
            "We utilize a blend of Cognitive Behavioral Therapy (CBT) and Mindfulness-Based Stress Reduction (MBSR) to help you identify triggers and develop a personalized toolkit for calm.",
            "Whether you're dealing with workplace burnout, social anxiety, or generalized worry, we provide a safe space to deconstruct these feelings and rebuild your sense of peace."
        ],
        benefits: ["Reduced physical tension", "Greater mental clarity", "Customized coping tools", "Improved sleep quality"]
    },
    "relationship-counseling": {
        title: "Relationship Counseling",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e84529ec1?auto=format&fit=crop&q=80&w=1000",
        description: "Foster deeper connections and resolve conflicts through compassionate communication and expert guidance.",
        longContent: [
            "Every relationship has its seasons of challenge. Our counseling service provides a neutral, structured environment to explore the dynamics of your connection.",
            "We focus on improving communication patterns, rebuilding trust, and rediscovering the shared values that brought you together in the first place.",
            "From pre-marital guidance to resolving long-standing conflicts, our therapists help couples develop the emotional intelligence needed for a thriving partnership."
        ],
        benefits: ["Effective communication", "Conflict resolution", "Emotional intimacy", "Trust restoration"]
    },
    "youth-mentorship": {
        title: "Youth Mentorship & Guidance",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000",
        description: "Empowering the next generation with the confidence and clarity needed to navigate modern adolescence.",
        longContent: [
            "Adolescence is a pivotal time of self-discovery and growth. Our mentorship program goes beyond traditional therapy to provide proactive guidance for young people.",
            "We help teens and young adults navigate social pressures, identity exploration, and the transition to adulthood with specialized emotional support.",
            "By pairing therapeutic insight with practical life-coaching, we empower youth to build a strong foundation of self-esteem and resilience."
        ],
        benefits: ["Improved self-confidence", "Social skill development", "Identity clarity", "Emotional resilience"]
    },
    "academic-guidance": {
        title: "Academic Guidance",
        image: "https://images.unsplash.com/photo-1434030216411-0bb7c3f3df44?auto=format&fit=crop&q=80&w=1000",
        description: "Navigating educational pathways and overcoming learning challenges with strategic personal development.",
        longContent: [
            "Academic pressure can deeply impact a student's mental well-8being. Our guidance service addresses the intersection of education and emotional health.",
            "We support students in managing exam anxiety, developing effective study habits, and navigating the difficult decisions surrounding career and educational paths.",
            "Our approach helps students find balance, reducing the 'burnout' often associated with high-pressure academic environments."
        ],
        benefits: ["Enhanced focus", "Reduced exam anxiety", "Better study-life balance", "Career path clarity"]
    },
    "emotional-peer-support": {
        title: "Emotional Support & Peer Counseling",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000",
        description: "A safe, shared space for connection and mutual understanding led by experienced peer facilitators.",
        longContent: [
            "Sometimes, the most powerful healing comes from knowing you are not alone. Our peer support groups offer a community-based approach to mental wellness.",
            "Led by trained facilitators with lived experience, these sessions provide a space for shared stories, mutual encouragement, and collective wisdom.",
            "We foster an environment of radical empathy and zero judgment, where participants can feel seen and heard in a way that only a peer community can provide."
        ],
        benefits: ["Sense of belonging", "Reduced isolation", "Shared coping strategies", "Mutual empowerment"]
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
                            {service.longContent.map((paragraph: string, i: number) => (
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
                                    {service.benefits.map((benefit: string, i: number) => (
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

            <Footer />
        </motion.main>
    );
}
