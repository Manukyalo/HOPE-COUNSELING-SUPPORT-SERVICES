"use client";

import { motion } from "framer-motion";

export default function Footer() {
    const whatsappNumber = "0701279231";
    const whatsappLink = `https://wa.me/254${whatsappNumber.substring(1)}`;

    return (
        <footer className="bg-gray-950 text-gray-400 py-24 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-600/20">H</div>
                            <span className="text-2xl font-black text-white tracking-tighter">HOPE COUNSELING</span>
                        </div>
                        <p className="max-w-sm leading-relaxed text-lg text-gray-500">
                            Providing professional psychological support and a safe space for your mental wellness journey. Located in Thika, Kenya.
                        </p>
                        <div className="flex gap-4 mt-10">
                            {/* WhatsApp integration */}
                            <motion.a
                                href={whatsappLink}
                                target="_blank"
                                whileHover={{ scale: 1.1, backgroundColor: "#25D366" }}
                                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white transition-colors"
                                title="Contact via WhatsApp"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.484 2.247 2.247 3.484 5.232 3.484 8.404 0 6.556-5.332 11.888-11.888 11.888-2.012 0-3.986-.511-5.741-1.482l-6.246 1.637zM6.502 18.067l.363.216c1.516.902 3.256 1.378 5.03 1.378 5.513 0 10.003-4.49 10.003-10.004 0-2.673-1.042-5.186-2.933-7.078-1.892-1.891-4.405-2.933-7.07-2.933-5.513 0-10.004 4.49-10.004 10.004 0 1.838.497 3.633 1.439 5.2l.237.394-1.054 3.848 3.993-1.045zM16.634 13.9c-.31-.155-1.838-.906-2.118-1.008-.28-.103-.485-.155-.688.155-.203.31-.787 1.008-.965 1.211-.177.202-.355.228-.666.073-.31-.155-1.308-.482-2.492-1.538-.92-.821-1.54-1.836-1.72-2.145-.18-.31-.019-.477.136-.631.14-.139.31-.362.465-.543.155-.181.206-.31.31-.517.103-.207.051-.388-.025-.543-.077-.155-.688-1.657-.942-2.27-.247-.6-.501-.517-.688-.527-.178-.009-.382-.01-.586-.01-.203 0-.533.078-.813.388-.28.31-1.066 1.042-1.066 2.54 0 1.498 1.091 2.946 1.242 3.153.151.207 2.145 3.275 5.196 4.59.726.313 1.292.5 1.731.639.73.232 1.393.199 1.918.121.585-.088 1.838-.751 2.096-1.474.258-.724.258-1.346.181-1.474-.077-.129-.282-.207-.591-.362z" />
                                </svg>
                            </motion.a>
                            {/* Email integration */}
                            <motion.a
                                href="mailto:amayakari5924@gmail.com"
                                whileHover={{ scale: 1.1, backgroundColor: "#EA4335" }}
                                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white transition-colors"
                                title="Send Email"
                            >
                                <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </motion.a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.3em]">Quick Links</h4>
                        <ul className="space-y-4 font-medium">
                            <li><a href="#services" className="hover:text-primary-400 transition-colors">Specialties</a></li>
                            <li><a href="#mood-tracker" className="hover:text-primary-400 transition-colors">Mood Hub</a></li>
                            <li><a href="#book" className="hover:text-primary-400 transition-colors">Book Session</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.3em]">Contact Us</h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-start gap-4">
                                <span className="text-primary-500 font-bold">@</span>
                                <span>amayakari5924@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-primary-500 font-bold">☏</span>
                                <span>0701279231</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-primary-500 font-bold">⚲</span>
                                <span>Thika, Kenya (HQ)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-600">
                    <p>© 2026 Hope Counseling Support Services.</p>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
