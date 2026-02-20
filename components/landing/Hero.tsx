"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export function Hero() {
    return (
        <section className="md:pt-48 md:pb-36 flex flex-col overflow-hidden text-center pt-32 pr-6 pb-24 pl-6 relative items-center">
            {/* Ambient Background Layers (Handled by AmbientBackground) */}

            <div className="relative z-10 flex flex-col items-center">
                {/* Laurel Motif */}
                <div className="mb-8 opacity-60">
                    <img
                        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3cb783e3-d3a8-4521-8174-9f5771f8e34b_320w.png?w=800&q=80"
                        alt="Laurel Motif"
                        className="w-16 h-16 object-contain"
                    />
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tighter mb-8 max-w-5xl mx-auto leading-[0.95] drop-shadow-2xl">
                    Intelligence Tailored
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-400 to-neutral-700">
                        For Academic Excellence.
                    </span>
                </h1>

                <p className="text-neutral-400 text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
                    Supercharge your academic trajectory with autonomous intelligence systems. We deploy enterprise-grade infrastructure that eliminates redundant tasks, accelerates learning velocity, and scales your performance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
                    <Link
                        href="/auth/register"
                        className="group isolate inline-flex cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(10,143,106,0.35)] rounded-full relative shadow-[0_8px_40px_rgba(10,143,106,0.25)] w-full sm:w-auto justify-center"
                        style={
                            {
                                "--spread": "90deg",
                                "--shimmer-color": "rgba(255,255,255,0.6)",
                                "--radius": "9999px",
                                "--speed": "4s",
                                "--cut": "1px",
                                "--bg": "rgba(255, 255, 255, 0.05)",
                            } as React.CSSProperties
                        }
                    >
                        <div className="absolute inset-0">
                            <div className="absolute inset-[-200%] w-[400%] h-[400%] animate-rotate-gradient">
                                <div className="absolute inset-0 bg-[conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]"></div>
                            </div>
                        </div>
                        <div className="absolute rounded-full bg-[var(--bg)] inset-[var(--cut)] backdrop-blur"></div>
                        <div
                            className="z-10 flex gap-2 sm:w-auto overflow-hidden text-xs uppercase font-semibold tracking-wider text-white w-full py-3.5 px-8 relative items-center justify-center"
                            style={{ borderRadius: "9999px" }}
                        >
                            <div className="absolute block w-[200%] h-[200%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),rgba(255,255,255,0.2),rgba(255,255,255,0.2),rgba(255,255,255,0.2),transparent)] animate-border-beam top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                            <div className="absolute inset-[1px] bg-[#0A8F6A]/90 rounded-full backdrop-blur-md"></div>
                            <span className="whitespace-nowrap relative z-10">Initialize System</span>
                        </div>
                    </Link>
                    <Link
                        href="#solutions"
                        className="flex items-center justify-center gap-2 px-8 py-3.5 glass-panel text-neutral-300 hover:text-white text-xs uppercase font-medium tracking-wider rounded-lg transition-colors w-full sm:w-auto group"
                    >
                        Inspect Architecture
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </div>

            <div className="mt-32 h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </section>
    );
}
