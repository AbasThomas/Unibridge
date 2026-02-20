"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Image
                            src="/logo.png"
                            alt="UniBridge logo"
                            width={50}
                            height={50}
                            className="h-[50px] w-[50px] object-contain"
                            priority
                        />
                        <span className="text-sm sm:text-lg font-bold tracking-tight text-white uppercase leading-none">
                            UniBridge Systems
                        </span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-[11px] font-medium tracking-wide uppercase text-neutral-500">
                        <Link href="#process" className="hover:text-white transition-colors duration-300">
                            Protocol
                        </Link>
                        <Link href="#ecosystem" className="hover:text-white transition-colors duration-300">
                            Ecosystem
                        </Link>
                        <Link href="#solutions" className="hover:text-white transition-colors duration-300">
                            Architecture
                        </Link>
                        <Link href="#pricing" className="hover:text-white transition-colors duration-300">
                            Pricing
                        </Link>
                    </nav>
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/auth/login"
                            className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/auth/register"
                            className="flex items-center justify-center px-5 py-2 bg-[#0A8F6A] text-white text-[11px] font-bold rounded-lg hover:bg-[#0A8F6A]/90 transition-all shadow-[0_0_20px_rgba(10,143,106,0.2)] uppercase tracking-wider"
                        >
                            Sign Up
                        </Link>
                    </div>
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <button
                        type="button"
                        aria-label="Close menu backdrop"
                        onClick={closeMobileMenu}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />
                    <aside className="absolute right-0 top-0 h-full w-[86%] max-w-sm border-l border-white/10 bg-[#050505] p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="UniBridge logo"
                                    width={50}
                                    height={50}
                                    className="h-[50px] w-[50px] object-contain"
                                />
                                <span className="text-sm font-bold tracking-tight text-white uppercase leading-none">
                                    UniBridge
                                </span>
                            </div>
                            <button
                                type="button"
                                aria-label="Close menu"
                                onClick={closeMobileMenu}
                                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="mt-8 space-y-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-300">
                            <Link href="#process" onClick={closeMobileMenu} className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 hover:text-white">
                                Protocol
                            </Link>
                            <Link href="#ecosystem" onClick={closeMobileMenu} className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 hover:text-white">
                                Ecosystem
                            </Link>
                            <Link href="#solutions" onClick={closeMobileMenu} className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 hover:text-white">
                                Architecture
                            </Link>
                            <Link href="#pricing" onClick={closeMobileMenu} className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 hover:text-white">
                                Pricing
                            </Link>
                        </nav>

                        <div className="mt-8 grid gap-3">
                            <Link
                                href="/auth/login"
                                onClick={closeMobileMenu}
                                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/auth/register"
                                onClick={closeMobileMenu}
                                className="inline-flex items-center justify-center rounded-lg bg-[#0A8F6A] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(10,143,106,0.2)]"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
