"use client";

import React, { useMemo } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes
 */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ParallaxStarsProps {
    /**
     * Optional title text
     */
    title?: string;
    /**
     * Optional subtitle or children
     */
    children?: React.ReactNode;
    /**
     * Additional classes
     */
    className?: string;
    /**
     * Speed multiplier
     * @default 1
     */
    speed?: number;
}

// Helper to generate random box shadows for stars
const generateBoxShadows = (n: number) => {
    let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
    for (let i = 2; i <= n; i++) {
        value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
    }
    return value;
};

export function ParallaxStars({
    title,
    children,
    className = "",
    speed = 1
}: ParallaxStarsProps) {
    // Memoize shadows
    const shadowsSmall = useMemo(() => generateBoxShadows(700), []);
    const shadowsMedium = useMemo(() => generateBoxShadows(200), []);
    const shadowsBig = useMemo(() => generateBoxShadows(100), []);

    return (
        <div className={cn("relative w-full h-full overflow-hidden bg-[#090A0F]", className)}>
            <style>{`
        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }
        .stars-gradient {
          background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
        }
      `}</style>

            {/* Background Gradient */}
            <div className="absolute inset-0 stars-gradient z-0" />

            {/* Star Layers */}
            <div
                className="absolute left-0 top-0 w-[1px] h-[1px] bg-transparent z-10 animate-[animStar_50s_linear_infinite]"
                style={{
                    boxShadow: shadowsSmall,
                    animationDuration: `${50 / speed}s`
                }}
            >
                <div className="absolute top-[2000px] w-[1px] h-[1px] bg-transparent" style={{ boxShadow: shadowsSmall }} />
            </div>

            <div
                className="absolute left-0 top-0 w-[2px] h-[2px] bg-transparent z-10 animate-[animStar_100s_linear_infinite]"
                style={{
                    boxShadow: shadowsMedium,
                    animationDuration: `${100 / speed}s`
                }}
            >
                <div className="absolute top-[2000px] w-[2px] h-[2px] bg-transparent" style={{ boxShadow: shadowsMedium }} />
            </div>

            <div
                className="absolute left-0 top-0 w-[3px] h-[3px] bg-transparent z-10 animate-[animStar_150s_linear_infinite]"
                style={{
                    boxShadow: shadowsBig,
                    animationDuration: `${150 / speed}s`
                }}
            >
                <div className="absolute top-[2000px] w-[3px] h-[3px] bg-transparent" style={{ boxShadow: shadowsBig }} />
            </div>

            {/* Content overlay if provided */}
            {(title || children) && (
                <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
                    {title && (
                        <h1 className="text-4xl md:text-6xl font-light tracking-[10px] text-white uppercase mb-8">
                            {title}
                        </h1>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
}
