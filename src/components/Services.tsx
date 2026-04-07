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
    <motion.section 
      id="services" 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-20 md:py-32 bg-[#f9f7f4]"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 md:mb-32">
          <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-4 block font-semibold animate-fade-rise">
            Our Expertise
          </span>
          <h2 className="font-instrument text-4xl md:text-[64px] text-[#0d2b22] leading-[1.1] animate-fade-rise-delay">
            Our <span className="italic text-[#7ecab0]">Specialized</span> Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group"
            >
              <Link href={`/services/${service.slug}`} className="block">
                <div className="overflow-hidden bg-white rounded-3xl border border-black/[0.03] transition-all duration-500 hover:shadow-2xl hover:shadow-[#0d2b22]/5">
                  {/* Top Image Area - Large Editorial Style */}
                  <div className="h-[280px] relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Card Body */}
                  <div className="p-10">
                    <h3 className="font-instrument text-[24px] text-[#0d2b22] mb-4 leading-tight group-hover:text-[#7ecab0] transition-colors">
                      {service.title}
                    </h3>
                    <p className="font-inter text-[14px] text-[#666] leading-relaxed mb-10 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="font-inter text-[11px] uppercase tracking-[0.1em] font-semibold text-[#0d2b22] flex items-center gap-3">
                      Explore Service
                      <div className="w-8 h-[1px] bg-[#0d2b22] transition-all duration-300 group-hover:w-12 group-hover:bg-[#7ecab0]" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
