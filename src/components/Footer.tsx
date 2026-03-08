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
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.3em]">Quick Links</h4>
                        <ul className="space-y-4 font-medium transition-all">
                            <li><a href="#about" className="hover:text-primary-400 transition-colors">About Us</a></li>
                            <li><a href="#services" className="hover:text-primary-400 transition-colors">Our Services</a></li>
                            <li><a href="#book" className="hover:text-primary-400 transition-colors">Book a Session</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.3em]">Contact Us</h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-center gap-4">
                                <span className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary-500 font-bold border border-white/10 hover:border-primary-500 transition-colors">@</span>
                                <span>amayakari5924@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary-500 font-bold border border-white/10 hover:border-primary-500 transition-colors">☏</span>
                                <span>0701279231</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary-500 font-bold border border-white/10 hover:border-primary-500 transition-colors">⚲</span>
                                <span>Thika, Kenya</span>
                            </li>
                            <li className="flex items-center gap-4 pt-4">
                                <motion.a
                                    href={whatsappLink}
                                    target="_blank"
                                    whileHover={{ scale: 1.1, backgroundColor: "#25D366", color: "white" }}
                                    className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 transition-all border border-white/10"
                                    title="Contact via WhatsApp"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.053.888 3.144.889h.002c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zM12.031 16.757c-1.131 0-2.115-.311-2.956-.816l-.212-.128-1.574.412.42-1.533-.141-.223c-.569-.912-.871-1.956-.87-3.029.001-3.08 2.505-5.585 5.586-5.585 3.081 0 5.585 2.505 5.585 5.585.001 3.081-2.505 5.585-5.586 5.585zM14.636 12.188c-.144-.072-.857-.423-.99-.47-.133-.048-.23-.072-.326.072-.097.144-.374.47-.458.566-.084.097-.168.109-.312.037-.144-.072-.607-.224-1.155-.712-.426-.379-.714-.848-.798-.992-.084-.144-.009-.222.063-.293.065-.064.144-.168.216-.252.072-.084.097-.144.144-.241.048-.096.024-.18-.012-.252-.036-.072-.326-.784-.446-1.073-.117-.282-.236-.243-.326-.248-.084-.005-.18-.006-.277-.006s-.253.036-.386.18c-.133.144-.506.494-.506 1.205 0 .711.518 1.398.59 1.494.072.096 1.02 1.557 2.471 2.183.345.149.614.238.823.304.346.11.662.094.912.057.279-.042.857-.35.976-.687.12-.337.12-.627.084-.687-.036-.06-.133-.096-.277-.168z" />
                                    </svg>
                                </motion.a>
                                <motion.a
                                    href="mailto:amayakari5924@gmail.com"
                                    whileHover={{ scale: 1.1, backgroundColor: "#EA4335", color: "white" }}
                                    className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 transition-all border border-white/10"
                                    title="Send Email"
                                >
                                    <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </motion.a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-600">
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
