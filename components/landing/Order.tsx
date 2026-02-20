"use client";

import { useEffect, useRef, useState } from "react";
import { Infinity, Trash, Clock, ShieldCheck, Lock, Plus, Users, Zap } from "lucide-react";

export function Order() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [liveStats, setLiveStats] = useState({
        activeStudents: 1240,
        currentDiscount: 15,
        lastUpdate: new Date().toLocaleTimeString()
    });

    useEffect(() => {
        // Simulate WebSocket connection for live pricing/stats
        const interval = setInterval(() => {
            setLiveStats(prev => ({
                activeStudents: prev.activeStudents + Math.floor(Math.random() * 5),
                currentDiscount: Math.max(5, Math.min(25, prev.currentDiscount + (Math.random() > 0.5 ? 1 : -1))),
                lastUpdate: new Date().toLocaleTimeString()
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            const revealElements = containerRef.current.querySelectorAll('.reveal');
            revealElements.forEach(el => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="order" className="py-32 px-6 relative overflow-hidden">
            <div className="relative max-w-5xl mx-auto text-center" ref={containerRef}>
                <div className="reveal">
                    <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tighter mb-8">
                        Initialize Your Success Today.
                    </h2>
                    <p className="text-neutral-400 mb-8 text-sm font-light">
                        Scalable solutions for students of all levels.
                        <br />
                        <span className="text-neutral-300">
                            ROI-focused. Rapid deployment. Systems that never sleep.
                        </span>
                    </p>

                    {/* Live Analytics Hub */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 border-[#0A8F6A]/20 bg-[#0A8F6A]/5">
                            <Users className="w-4 h-4 text-[#0A8F6A]" />
                            <span className="text-xs font-semibold text-white tracking-wider uppercase">
                                {liveStats.activeStudents.toLocaleString()} Active Students
                            </span>
                        </div>
                        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 border-emerald-500/20 bg-emerald-500/5">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-semibold text-white tracking-wider uppercase">
                                {liveStats.currentDiscount}% Dynamic Discount
                            </span>
                        </div>
                        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 border-white/5 bg-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0A8F6A] animate-pulse" />
                            <span className="text-[10px] font-medium text-neutral-400 tracking-widest uppercase">
                                Live Feed: {liveStats.lastUpdate}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Option 1 */}
                    <button className="glass-panel p-8 rounded-2xl hover:border-white/20 transition-all group flex flex-col items-center relative overflow-hidden reveal delay-0">
                        <span className="text-xs text-neutral-400 font-medium uppercase tracking-widest mb-4">
                            Protocol
                        </span>
                        <span className="text-3xl font-bold text-white mb-8">₦0</span>
                        <div className="px-6 py-3 bg-neutral-800 border border-white/5 text-white text-xs font-semibold uppercase tracking-wider rounded group-hover:bg-white group-hover:text-black transition-colors w-full">
                            Join Now
                        </div>
                    </button>

                    {/* Option 2 (Featured) */}
                    <button className="relative p-8 rounded-2xl bg-[#0A8F6A]/10 border border-[#0A8F6A] hover:bg-[#0A8F6A]/20 transition-all group flex flex-col items-center overflow-hidden shadow-[0_0_40px_-10px_rgba(10,143,106,0.2)] transform md:-translate-y-4 reveal delay-100">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0A8F6A]/10 to-transparent opacity-50"></div>
                        <div className="absolute top-0 px-4 py-1 bg-[#0A8F6A] text-white text-[10px] uppercase font-bold tracking-widest rounded-b-lg">
                            Most Popular
                        </div>

                        <span className="text-xs text-[#0A8F6A] font-bold uppercase tracking-widest mb-4 mt-2 relative z-10">
                            Logic Tier
                        </span>
                        <span className="text-3xl font-bold text-white mb-8 relative z-10">
                            ₦1,900
                        </span>
                        <div className="relative z-10 px-6 py-3 bg-[#0A8F6A] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#097a5b] transition-colors w-full shadow-lg">
                            Authorize Access
                        </div>
                    </button>

                    {/* Option 3 */}
                    <button className="glass-panel p-8 rounded-2xl hover:border-white/20 transition-all group flex flex-col items-center relative overflow-hidden reveal delay-200">
                        <span className="text-xs text-neutral-400 font-medium uppercase tracking-widest mb-4">
                            Scaling
                        </span>
                        <span className="text-3xl font-bold text-white mb-8">Custom</span>
                        <div className="px-6 py-3 bg-neutral-800 border border-white/5 text-white text-xs font-semibold uppercase tracking-wider rounded group-hover:bg-white group-hover:text-black transition-colors w-full">
                            Contact Support
                        </div>
                    </button>
                </div>

                <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden group text-left mb-12 border border-white/5 hover:border-[#0A8F6A]/30 transition-colors duration-300 reveal delay-300">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#0A8F6A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-start gap-5 w-full md:w-auto">
                            <div className="w-10 h-10 rounded-lg bg-[#0A8F6A]/10 flex items-center justify-center text-[#0A8F6A] shrink-0 border border-[#0A8F6A]/20">
                                <Infinity className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-white font-medium">Priority Support Retainer</h3>
                                    <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-neutral-400 bg-white/5 uppercase tracking-wider">
                                        Optional
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-400 mt-1 max-w-md font-light leading-relaxed">
                                    We manage resource updates, personalized alerts, and system health.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pl-14 md:pl-0">
                            <div className="text-right">
                                <span className="block text-2xl font-semibold text-white tracking-tight">
                                    ₦500
                                </span>
                                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                    / Semester
                                </span>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A8F6A]/10 border border-[#0A8F6A]/20 text-[#0A8F6A] hover:bg-[#0A8F6A] hover:text-white text-xs font-semibold uppercase tracking-wider rounded transition-all duration-300">
                                <span>Add</span>
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center text-[10px] text-neutral-500 uppercase tracking-widest reveal delay-400">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Instant Delivery
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" />
                        Academic Guarantee
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        Encrypted Data
                    </div>
                </div>
            </div>
        </section>
    );
}
