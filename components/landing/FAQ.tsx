"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
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


    const faqs = [
        {
            question: "Is UniBridge authorized for all students?",
            answer:
                "Yes. Basic protocol access to UniBridge, including lecture deconstructions and opportunity streams, is authorized for all verified Nigerian university students.",
        },
        {
            question: "How is student identity authenticated?",
            answer:
                "We use university-issued credentials or student ID logic to verify enrollment status, ensuring a secure and encrypted academic community.",
        },
        {
            question: "Can I deploy my own high-yield notes?",
            answer:
                "Absolutely. UniBridge is an open-source of intelligence. You can deploy and arbitrage your high-quality lecture deconstructions and study assets to other students.",
        },
    ];

    return (
        <section id="faq" className="py-24 px-6 border-t border-white/5 bg-black/40">
            <div className="max-w-2xl mx-auto" ref={containerRef}>
                <div className="reveal">
                    <h2 className="text-2xl font-medium text-white tracking-tight mb-12 text-center">
                        Operational Intel
                    </h2>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-white/5 rounded-lg bg-white/[0.02] overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-5 text-left text-sm font-medium text-white hover:bg-white/5 transition-colors"
                                >
                                    {faq.question}
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform text-neutral-500 ${openIndex === index ? "rotate-180" : "rotate-0"
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-out overflow-hidden grid ${openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="p-5 pt-0 text-sm text-neutral-400 font-light leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
