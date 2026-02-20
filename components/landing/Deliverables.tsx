"use client";

import { useEffect, useRef } from "react";

export function Deliverables() {
    const stats = [
        { value: "24/7", label: "Academic Resilience", desc: "Systems that never sleep, ensuring no insight or resource is lost." },
        { value: "10x", label: "Learning Retention", desc: "Accelerate your recall velocity without added cramming effort." },
        { value: "100%", label: "Quality Education", desc: "Access to verified, peer-reviewed, and high-yield academic assets." },
        { value: "Global", label: "Reduced Inequality", desc: "Bridging the gap between students and opportunities worldwide." },
    ];

    const containerRef = useRef<HTMLDivElement>(null);

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
        <section className="py-24 px-6 border-b border-white/5 relative bg-black/20">
            <div className="max-w-6xl mx-auto" ref={containerRef}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`glass-panel p-8 rounded-xl text-center reveal group hover:border-[#0A8F6A]/30 transition-all duration-500 delay-${index * 75}`}
                            style={{ transitionDelay: `${index * 75}ms` }}
                        >
                            <div className="text-4xl font-semibold text-white mb-3 tracking-tighter group-hover:text-[#0A8F6A] transition-colors">
                                {stat.value}
                            </div>
                            <div className="h-px w-8 bg-white/10 mx-auto my-4 group-hover:bg-[#0A8F6A]/50 transition-colors"></div>
                            <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium mb-2">
                                {stat.label}
                            </p>
                            <p className="text-[10px] text-neutral-500 leading-relaxed max-w-[180px] mx-auto">
                                {stat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
