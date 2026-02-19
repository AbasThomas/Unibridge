"use client";

import { useEffect, useRef } from "react";
import { Bot, Zap, MessageSquare, Database, Workflow } from "lucide-react";

export function Agents() {
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

    const agents = [
        {
            icon: Zap,
            title: "Study Agent",
            desc: "Deconstructs complex lectures into high-yield summaries. Never study alone again.",
            label: "High-Yield",
            color: "text-[#0A8F6A]",
            bg: "bg-[#0A8F6A]/10",
            border: "hover:border-[#0A8F6A]/30",
        },
        {
            icon: MessageSquare,
            title: "Search Bot",
            desc: "Replies to academic queries instantly. Trained on your university's data.",
            label: "Real-Time",
            color: "text-neutral-300 group-hover:text-white",
            bg: "bg-white/5",
            border: "hover:border-white/20",
            popular: true,
        },
        {
            icon: Database,
            title: "Resource Optimizer",
            desc: "Enrich your study materials and aggregate data automatically.",
            label: "Autonomous",
            color: "text-neutral-300 group-hover:text-white",
            bg: "bg-white/5",
            border: "hover:border-white/20",
        },
        {
            icon: Workflow,
            title: "Growth Manager",
            desc: "Orchestrates your career trajectory. Complete autonomy in opportunity sourcing.",
            label: "Strategic",
            color: "text-neutral-300 group-hover:text-white",
            bg: "bg-white/5",
            border: "hover:border-white/20",
        },
    ];

    return (
        <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto" ref={containerRef}>
                <div className="flex items-center gap-3 mb-10 reveal">
                    <div className="p-2 rounded bg-white/5 border border-white/10">
                        <Bot className="w-4 h-4 text-[#0A8F6A]" />
                    </div>
                    <h2 className="text-2xl font-medium text-white tracking-tight">
                        Deployed Intelligence
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {agents.map((agent, index) => (
                        <div
                            key={index}
                            className={`glass-panel p-8 rounded-xl ${agent.border} group transition-all duration-500 reveal delay-${index * 75}`}
                            style={{ transitionDelay: `${index * 75}ms` }}
                        >
                            <div
                                className={`w-10 h-10 rounded-lg ${agent.bg} flex items-center justify-center mb-6 ${agent.color} group-hover:scale-110 transition-transform duration-500`}
                            >
                                <agent.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-medium mb-2">{agent.title}</h3>
                            <p className="text-xs text-neutral-400 mb-6 font-light leading-relaxed">
                                {agent.desc}
                            </p>
                            {agent.popular ? (
                                <span className="text-[10px] px-2 py-1 rounded border border-white/10 text-neutral-400">
                                    {agent.label}
                                </span>
                            ) : (
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-semibold text-white">
                                        {agent.label}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
