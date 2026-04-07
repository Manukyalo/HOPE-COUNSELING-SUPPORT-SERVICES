"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const monitorVideo = () => {
      if (!video) return;
      
      const fadeDuration = 0.5; // 0.5s as per prompt
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (!isNaN(duration)) {
        // Fade in logic
        if (currentTime < fadeDuration) {
          setOpacity(currentTime / fadeDuration);
        } 
        // Fade out logic
        else if (currentTime > duration - fadeDuration) {
          setOpacity(Math.max(0, (duration - currentTime) / fadeDuration));
        } 
        // Fully visible
        else {
          setOpacity(1);
        }
      }

      rafId = requestAnimationFrame(monitorVideo);
    };

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play();
        }
      }, 100); // 100ms pause as per prompt
    };

    video.addEventListener("ended", handleEnded);
    rafId = requestAnimationFrame(monitorVideo);

    return () => {
      video.removeEventListener("ended", handleEnded);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0d2b22]">
      {/* Background Video Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-100"
        style={{ 
          opacity: opacity,
        }}
      >
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          className="w-full h-full object-cover"
          muted
          playsInline
          autoPlay
        />
        {/* Deep Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d2b22] via-[#0d2b22]/40 to-[#0d2b22] z-[1]" />
        <div className="absolute inset-0 bg-black/20 z-[1]" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-8 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl tracking-tight font-instrument text-white flex items-center">
          Hope Counseling<sup className="text-[10px] ml-0.5 opacity-60">®</sup>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 font-inter text-[13px] tracking-wide uppercase">
          <Link href="/" className="text-white hover:opacity-70 transition-opacity">Home</Link>
          <Link href="/#services" className="text-white/60 hover:text-[#7ecab0] transition-colors">Services</Link>
          <Link href="/approach" className="text-white/60 hover:text-[#7ecab0] transition-colors">Approach</Link>
          <Link href="/about" className="text-white/60 hover:text-[#7ecab0] transition-colors">About</Link>
          <Link href="/contact" className="text-white/60 hover:text-[#7ecab0] transition-colors">Reach Us</Link>
        </div>

        <Link 
          href="/#book" 
          className="bg-white text-[#0d2b22] px-7 py-2.5 rounded-full text-sm font-medium transition-transform hover:scale-[1.03]"
        >
          Begin Journey
        </Link>
      </nav>

      {/* Hero Section Content */}
      <section 
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[calc(100vh-120px)]"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-instrument leading-[0.9] tracking-[-0.04em] text-white animate-fade-rise">
            Beyond silence, we build <br />
            <span className="italic text-[#7ecab0]">the healing.</span>
          </h1>

          <p className="font-inter text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mt-10 mx-auto leading-relaxed animate-fade-rise-delay">
            Providing a safe haven for brilliant minds and thoughtful souls. 
            Through the noise of life, we craft modern-day support for 
            deep healing and pure emotional flow.
          </p>

          <div className="mt-14 animate-fade-rise-delay-2">
            <Link 
              href="/#book"
              className="bg-[#7ecab0] text-[#0d2b22] rounded-full px-12 py-5 text-base font-medium transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#7ecab0]/20"
            >
              Begin Healing Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Padding as per prompt (pb-40) */}
      <div className="pb-40" />
    </div>
  );
}
