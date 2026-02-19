"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";

export function Header() {
    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-6 h-6">
                        <Cpu className="w-6 h-6 text-[#0A8F6A]" />
                    </div>
                    <span className="font-semibold tracking-tighter text-white text-xs uppercase">
                        UniBridge Systems
                    </span>
                </div>
                <nav className="hidden md:flex gap-8 text-[11px] font-medium tracking-wide uppercase text-neutral-500">
                    <Link href="#process" className="hover:text-white transition-colors duration-300">
                        Protocol
                    </Link>
                    <Link href="#solutions" className="hover:text-white transition-colors duration-300">
                        Architecture
                    </Link>
                    <Link href="#faq" className="hover:text-white transition-colors duration-300">
                        Intel
                    </Link>
                </nav>
                <Link
                    href="/auth/register"
                    className="hidden md:flex items-center justify-center px-4 py-1.5 bg-white/5 border border-white/10 text-white text-[11px] font-medium rounded hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
                >
                    Initialize Access
                </Link>
            </div>
        </header>
    );
}
