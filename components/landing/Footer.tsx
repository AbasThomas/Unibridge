"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-16 border-t border-white/5 text-center bg-black/40 backdrop-blur-md">
            <div className="flex items-center justify-center gap-3 mb-6 opacity-50"></div>
            <p className="text-sm font-semibold text-white tracking-tight mb-2 uppercase">
                UniBridge Systems
            </p>
            <p className="text-[10px] text-neutral-600 mb-10 tracking-[0.2em] uppercase">
                Autonomous Intelligence for Nigerian Universities.
            </p>

            <div className="flex justify-center gap-8 text-[10px] text-neutral-600 uppercase tracking-widest font-medium">
                <Link href="#" className="hover:text-white transition-colors">
                    Terms
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                    Contact
                </Link>
            </div>
        </footer>
    );
}
