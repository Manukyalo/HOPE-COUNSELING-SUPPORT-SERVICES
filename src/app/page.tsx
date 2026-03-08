"use client";

import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BookingFlow from "@/components/BookingFlow";
import About from "@/components/About";
import ExtraFeatures from "@/components/ExtraFeatures";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Hero />

            <About />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <Services />
            </motion.div>

            <ExtraFeatures />

            <section id="book" className="py-20 bg-primary-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <BookingFlow />
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
