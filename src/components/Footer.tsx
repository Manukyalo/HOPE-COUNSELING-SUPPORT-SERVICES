"use client";

import Link from "next/link";

export default function Footer() {
  const whatsappLink = "https://wa.me/254701279231";

  return (
    <footer className="bg-[#0d2b22] text-[#f5f2ec] py-20 md:py-32 relative overflow-hidden">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Subtle Wordmark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none overflow-hidden hidden md:block">
          <span className="font-playfair text-[120px] lg:text-[180px] uppercase tracking-[0.2em] text-white/[0.03] whitespace-nowrap leading-none">
            HOPE COUNSELING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-24 md:mb-32 relative z-10">
          {/* Brand Col */}
          <div className="flex flex-col">
            <span className="font-playfair text-2xl mb-6">Hope Counseling</span>
            <p className="font-sans text-[11px] text-[#f5f2ec]/40 leading-relaxed max-w-[200px] uppercase tracking-wider">
              © 2026 Hope Counseling Support Services. Professional psychological support in Thika, Kenya.
            </p>
          </div>

          {/* Nav Col */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col gap-4">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-2 font-medium">Nav</span>
              <ul className="space-y-3 font-sans text-xs uppercase tracking-widest text-[#f5f2ec]/60">
                <li><Link href="/#about" className="hover:text-[#7ecab0] transition-colors">About</Link></li>
                <li><Link href="/#services" className="hover:text-[#7ecab0] transition-colors">Services</Link></li>
                <li><Link href="/approach" className="hover:text-[#7ecab0] transition-colors">Approach</Link></li>
                <li><Link href="/contact" className="hover:text-[#7ecab0] transition-colors">Contact</Link></li>
                <li><Link href="/#book" className="hover:text-[#7ecab0] transition-colors">Booking</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Col */}
          <div className="flex flex-col md:items-end">
            <div className="flex flex-col gap-4 md:items-end w-full md:w-auto">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7ecab0] mb-2 font-medium">Connect</span>
              <ul className="space-y-3 font-sans text-xs uppercase tracking-widest text-[#f5f2ec]/60 md:text-right">
                <li><a href="https://instagram.com" target="_blank" className="hover:text-[#7ecab0] transition-colors">Instagram</a></li>
                <li><a href={whatsappLink} target="_blank" className="hover:text-[#7ecab0] transition-colors">WhatsApp</a></li>
                <li><a href="mailto:amayakari5924@gmail.com" className="hover:text-[#7ecab0] transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="pt-12 border-t border-white/[0.05] text-center relative z-10">
          <p className="font-playfair italic text-sm text-[#f5f2ec]/60">
            Healing within reach.
          </p>
        </div>
      </div>
    </footer>
  );
}
