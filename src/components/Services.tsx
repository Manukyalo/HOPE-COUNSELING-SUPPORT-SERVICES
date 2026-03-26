"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    slug: "stress-anxiety-management",
    title: "Stress and Anxiety management",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    description: "Master tools to navigate life's pressures and find your internal calm using evidence-based techniques."
  },
  {
    slug: "relationship-counseling",
    title: "Relationship Counseling",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800",
    description: "Foster deeper connections and resolve conflicts through compassionate communication and expert guidance."
  },
  {
    slug: "youth-mentorship",
    title: "Youth mentorship and guidance",
    image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?auto=format&fit=crop&q=80&w=800",
    description: "Empowering the next generation with the confidence and clarity needed to navigate modern adolescence."
  },
  {
    slug: "academic-guidance",
    title: "Academic guidance",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    description: "Navigating educational pathways and overcoming learning challenges with strategic personal development."
  },
  {
    slug: "emotional-peer-support",
    title: "Emotional support and Peer Counseling",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
    description: "A safe, shared space for connection and mutual understanding led by experienced peer facilitators."
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32 bg-[#f9f7f4]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#7ecab0] mb-3 block font-medium">
            Our Expertise
          </span>
          <h2 className="font-playfair text-3xl md:text-[42px] text-[#0d2b22] leading-tight">
            Our <span className="italic">Specialized</span> Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <Link href={`/services/${service.slug}`} className="block">
                <div className="bg-white rounded-[16px] border border-black/[0.05] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {/* Top Image Area */}
                  <div className="h-[120px] relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Floating icon badge */}
                    <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/25 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                      <div className="w-3 h-3 bg-white/60 rounded-sm" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="font-playfair text-[15px] text-[#0d2b22] mb-3 group-hover:text-[#7ecab0] transition-colors uppercase tracking-tight">
                      {service.title}
                    </h3>
                    <p className="font-sans text-[12px] text-[#666] leading-relaxed mb-6 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#0d2b22] flex items-center gap-2 group/link">
                      Learn More 
                      <span className="transition-transform group-hover/link:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
