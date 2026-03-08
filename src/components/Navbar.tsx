"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
            }`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">H</div>
                    <span className={`text-xl font-bold tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
                        HOPE <span className="font-light text-primary-500">SERVICES</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {["Services", "Check In"].map((item) => (
                        <a
                            key={item}
                            href={item === "Check In" ? "#book" : `#${item.toLowerCase().replace(" ", "-")}`}
                            className={`font-medium transition-colors hover:text-primary-500 ${scrolled ? "text-gray-600" : "text-gray-200"}`}
                        >
                            {item}
                        </a>
                    ))}
                    <a
                        href="#book"
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold transition-all shadow-md shadow-primary-600/20"
                    >
                        Book Now
                    </a>
                </div>

                {/* Mobile Toggle (Simple) */}
                <button className={`md:hidden p-2 ${scrolled ? "text-gray-900" : "text-white"}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
