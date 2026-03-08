"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
export const dynamic = 'force-dynamic';

interface Service {
    title: string;
    image: string;
    description: string;
    longContent: string[];
    benefits: string[];
}

const servicesDetails: Record<string, Service> = {
    "stress-anxiety-management": {
        title: "Stress and Anxiety management",
        image: "https://images.unsplash.com/photo-1474418397713-7dedd4d2b45a?auto=format&fit=crop&q=80&w=800",
        description: "Master tools to navigate life's pressures and find your internal calm using evidence-based techniques.",
        longContent: [
            "Life's pressures can often feel overwhelming, but you don't have to navigate them alone. Our stress and anxiety management sessions provide a compassionate and professional space to understand the root causes of your tension.",
            "We utilize evidence-based techniques such as Cognitive Behavioral Therapy (CBT) and mindfulness-based stress reduction to help you regain control. Together, we'll develop a personalized toolkit of coping mechanisms that fit your lifestyle and help you find lasting calm."
        ],
        benefits: ["Reduced physical symptoms of stress", "Improved emotional regulation", "Better sleep and focus", "Enhanced decision-making clarity"]
    },
    "relationship-counseling": {
        title: "Relationship Counseling",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e84529ec1?auto=format&fit=crop&q=80&w=800",
        description: "Foster deeper connections and resolve conflicts through compassionate communication and expert guidance.",
        longContent: [
            "Healthy relationships are the cornerstone of a fulfilling life. Whether you're navigating partnership challenges, family dynamics, or workplace connections, our relationship counseling offers a neutral ground for clear, empathetic communication.",
            "We focus on identifying destructive patterns and replacing them with constructive dialogue. Our goal is to help you build stronger, more resilient connections based on mutual respect and understanding."
        ],
        benefits: ["Improved communication skills", "Conflict resolution strategies", "Deeper emotional intimacy", "Clearer boundary setting"]
    },
    "youth-mentorship": {
        title: "Youth mentorship and guidance",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
        description: "Empowering the next generation with the confidence and clarity needed to navigate modern adolescence.",
        longContent: [
            "Adolescence and young adulthood are periods of profound change and often, confusion. Our youth mentorship program goes beyond traditional counseling to offer active guidance and support.",
            "We work with young people to build self-esteem, identify personal goals, and navigate the social and academic pressures of the modern world. It's about empowering them to become the healthiest versions of themselves."
        ],
        benefits: ["Increased self-confidence", "Goal identification and planning", "Better social navigation", "Improved parent-child dynamics"]
    },
    "academic-guidance": {
        title: "Academic guidance",
        image: "https://images.unsplash.com/photo-1434030216411-0bb7c3f3df44?auto=format&fit=crop&q=80&w=800",
        description: "Navigating educational pathways and overcoming learning challenges with strategic personal development.",
        longContent: [
            "Academic success isn't just about hard work; it's about the right strategy and mindset. We provide support for students facing learning hurdles, exam anxiety, or transition challenges between educational levels.",
            "From study skills to career pathway exploration, we help students align their strengths with their academic pursuits for a more meaningful and successful educational journey."
        ],
        benefits: ["Strategic study techniques", "Reduced academic anxiety", "Clarity on career pathways", "Improved time management"]
    },
    "emotional-peer-support": {
        title: "Emotional support and Peer Counseling",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
        description: "A safe, shared space for connection and mutual understanding led by experienced peer facilitators.",
        longContent: [
            "Sometimes, the most powerful healing comes from knowing you are not alone. Our emotional peer support and peer counseling sessions provide a unique space for shared experiences.",
            "Facilitated by experienced counselors, these sessions emphasize mutual understanding, validated feelings, and the strength found in community. It's a sanctuary for those seeking connection on their mental wellness journey."
        ],
        benefits: ["Sense of community and belonging", "Validation from shared lived experience", "Reduced feelings of isolation", "Social skill reinforcement"]
    }
};

export async function generateStaticParams() {
    return Object.keys(servicesDetails).map((slug) => ({
        slug: slug,
    }));
}

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
                {/* ... rest of the section ... */}

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

        </motion.main>
    );
}
