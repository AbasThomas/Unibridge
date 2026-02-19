"use client";

import { useEffect, useRef } from "react";

export function Process() {
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

    const steps = [
        { num: "01", title: "Audit", desc: "We analyze your current manual workflows.", highlight: false },
        { num: "02", title: "Blueprint", desc: "We design a custom automation architecture.", highlight: false },
        { num: "03", title: "Deploy", desc: "We build, test, and launch your AI agents.", highlight: true },
        { num: "04", title: "Optimize", desc: "Continuous monitoring and improvement.", highlight: false },
    ];

    return (
        <section id="process" className="py-32 px-6 border-t border-white/5 bg-neutral-900/10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto" ref={containerRef}>
                <h2 className="text-2xl font-medium text-white tracking-tight mb-16 text-center reveal">
                    Integration Protocol
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"></div>

                    {[
                        { num: "01", title: "Access Initialization", desc: "Secure your terminal and authenticate your student profile.", highlight: false },
                        { num: "02", title: "Blueprint Analysis", desc: "Select your institution and academic level for localized intel.", highlight: false },
                        { num: "03", title: "Logic Deployment", desc: "Initialize specialized AI agents to scan and structure your course load.", highlight: true },
                        { num: "04", title: "Precision Scaling", desc: "Thrive with autonomous resource curation and opportunity alerts.", highlight: false },
                    ].map((step, index) => (
                        <div
                            key={index}
                            className={`flex flex-col md:items-center md:text-center reveal delay-${index * 75}`}
                            style={{ transitionDelay: `${index * 75}ms` }}
                        >
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white mb-6 z-10 ${step.highlight
                                    ? "bg-[#0A8F6A] shadow-[0_0_25px_rgba(10,143,106,0.4)] ring-4 ring-black/50"
                                    : "glass-panel shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    }`}
                            >
                                {step.num}
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">
                                {step.title}
                            </h3>
                            <p className="text-xs text-neutral-500 leading-relaxed max-w-[200px]">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
