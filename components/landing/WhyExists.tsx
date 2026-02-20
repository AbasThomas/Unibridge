"use client";

import { useEffect, useRef } from "react";
import { Cpu } from "lucide-react";

export function WhyExists() {
    const revealRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

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

        if (revealRef.current) observer.observe(revealRef.current);
        if (panelRef.current) observer.observe(panelRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-32 px-6 border-b border-white/5 relative z-10" id="why-unibridge">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div ref={revealRef} className="reveal space-y-8">
                    <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tighter">
                        The Productivity Deficit.
                    </h2>
                    <div className="space-y-8">
                        <div className="flex items-start gap-5 group">
                            <div className="w-0.5 h-12 bg-neutral-800 group-hover:bg-neutral-700 transition-colors mt-1"></div>
                            <div>
                                <h4 className="text-white text-sm font-medium mb-2">
                                    Legacy Methodologies
                                </h4>
                                <p className="text-neutral-500 text-sm font-light leading-relaxed">
                                    Fragmented resources, manual synthesis, and redundant study cycles create massive inefficiencies. Traditional academic approaches force students to optimize for endurance rather than insight.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5 group">
                            <div className="w-0.5 h-12 bg-[#0A8F6A] shadow-[0_0_15px_rgba(10,143,106,0.5)] mt-1"></div>
                            <div>
                                <h4 className="text-white text-sm font-medium mb-2">
                                    The UniBridge Protocol
                                </h4>
                                <p className="text-neutral-400 text-sm font-light leading-relaxed">
                                    We deploy autonomous infrastructure that organizes your academic corpus, surfaces high-value opportunities, and executes precision learning protocols with 24/7 reliability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    ref={panelRef}
                    className="glass-panel p-10 rounded-2xl relative overflow-hidden group reveal delay-100"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0A8F6A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Cpu className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl font-light text-neutral-200 leading-relaxed mb-8 relative z-10">
                        &quot;Any intelligence system applied to an optimized workflow will compound academic excellence exponentially.&quot;
                    </p>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-6 h-px bg-[#0A8F6A]"></div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#0A8F6A] font-semibold">
                            UniBridge Systems
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
