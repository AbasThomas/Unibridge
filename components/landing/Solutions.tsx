"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

type Tab = "lectures" | "resources" | "opportunities";

export function Solutions() {
    const [activeTab, setActiveTab] = useState<Tab>("lectures");
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
            const revealElements = containerRef.current.querySelectorAll(".reveal");
            revealElements.forEach((el) => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    const tabs = [
        { id: "lectures", label: "Lectures" },
        { id: "resources", label: "Resources" },
        { id: "opportunities", label: "Opportunities" },
    ];

    return (
        <section id="solutions" className="py-32 px-6 relative">
            <div className="max-w-5xl mx-auto" ref={containerRef}>
                <div className="text-center mb-20 reveal">
                    <h2 className="text-3xl font-medium text-white tracking-tight mb-4">
                        Tactical Solutions.
                    </h2>
                    <p className="text-neutral-500 text-sm">
                        Deploy systems that actually move the needle for your academic success.
                    </p>
                </div>

                {/* Custom Floating Tabs */}
                <div className="w-full reveal delay-100">
                    <div className="flex flex-col sm:flex-row justify-center mb-12">
                        <div className="inline-flex bg-neutral-900/40 backdrop-blur-md p-1.5 rounded-full border border-white/5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={`px-8 py-2.5 text-xs font-medium rounded-full transition-all duration-300 ${activeTab === tab.id
                                        ? "bg-white/10 text-white shadow-lg border border-white/10"
                                        : "text-neutral-500 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === "lectures" && (
                            <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden animate-soft-fade">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A8F6A]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-8 border-b border-white/5 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-medium text-white mb-2">
                                            Autonomous Intel
                                        </h3>
                                        <p className="text-neutral-400 text-sm font-light">
                                            Qualify and summarize core concepts before they become exam bottlenecks.
                                        </p>
                                    </div>
                                    <div className="mt-6 md:mt-0 text-left md:text-right">
                                        <span className="block text-3xl font-bold text-white tracking-tight">
                                            +1,200
                                        </span>
                                        <span className="block text-[10px] uppercase tracking-wider text-[#0A8F6A] font-medium">
                                            Weekly Data Points
                                        </span>
                                    </div>
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 relative z-10">
                                    {[
                                        "24/7 Real-time Concept Qualification",
                                        "Autonomous Lecture Deconstruction",
                                        "Multi-channel Resource Enrichment",
                                        "Precision Q&A Logic Engine",
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-sm text-neutral-300">
                                            <div className="mt-0.5 p-0.5 rounded-full bg-[#0A8F6A]/20 text-[#0A8F6A]">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="font-light">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === "resources" && (
                            <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden animate-soft-fade">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A8F6A]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-8 border-b border-white/5 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-medium text-white mb-2">
                                            Verified Knowledge
                                        </h3>
                                        <p className="text-neutral-400 text-sm font-light">
                                            The centralized hub for high-yield educational assets.
                                        </p>
                                    </div>
                                    <div className="mt-6 md:mt-0 text-left md:text-right">
                                        <span className="block text-3xl font-bold text-white tracking-tight">
                                            1k+
                                        </span>
                                        <span className="block text-[10px] uppercase tracking-wider text-[#0A8F6A] font-medium">
                                            Curated Assets
                                        </span>
                                    </div>
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 relative z-10">
                                    {[
                                        "Peer-to-Peer Knowledge Arbitrage",
                                        "Strategic Past-Question Archives",
                                        "Interactive Handout Repositories",
                                        "Encrypted Document Governance",
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-sm text-neutral-300">
                                            <div className="mt-0.5 p-0.5 rounded-full bg-[#0A8F6A]/20 text-[#0A8F6A]">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="font-light">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === "opportunities" && (
                            <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden animate-soft-fade">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A8F6A]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-8 border-b border-white/5 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-medium text-white mb-2">
                                            Growth Protocols
                                        </h3>
                                        <p className="text-neutral-400 text-sm font-light">
                                            Scale your career trajectory with automated opportunity sourcing.
                                        </p>
                                    </div>
                                    <div className="mt-6 md:mt-0 text-left md:text-right">
                                        <span className="block text-3xl font-bold text-white tracking-tight">
                                            New
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider text-[#0A8F6A] font-medium">
                                            Strategic Updates
                                        </span>
                                    </div>
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 relative z-10">
                                    {[
                                        "Global Scholarship Surveillance",
                                        "Remote Internship Pipelines",
                                        "Direct Research Grant Access",
                                        "Competitive Landscape Analysis",
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-sm text-neutral-300">
                                            <div className="mt-0.5 p-0.5 rounded-full bg-[#0A8F6A]/20 text-[#0A8F6A]">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="font-light">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
