"use client";

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000')",
                }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    Find Your Path to <span className="text-primary-300">Inner Peace</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Professional counseling services tailored to your journey. We provide a safe space for growth, healing, and support.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <a
                        href="#book"
                        className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary-500/30"
                    >
                        Book a Session
                    </a>
                    <a
                        href="#services"
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all backdrop-blur-md border border-white/30"
                    >
                        Explore Services
                    </a>
                </div>
            </div>

            {/* Floating Elements for Premium Feel */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary-400 to-transparent"></div>
            </div>
        </section>
    );
}
