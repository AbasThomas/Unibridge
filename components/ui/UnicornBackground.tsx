"use client";

import { useEffect } from "react";
import Script from "next/script";

export function UnicornBackground() {
    useEffect(() => {
        // Check if script is already loaded to avoid duplicates
        if (window.UnicornStudio?.isInitialized) return;
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[50vh] md:h-screen -z-10 transition-all duration-700 pointer-events-none">
            <div
                className="aura-background-component absolute top-0 w-full h-full -z-10 saturate-0 opacity-80"
                data-alpha-mask="80"
                style={{
                    maskImage: "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)"
                }}
            >
                <div
                    data-us-project="BqS5vTHVEpn6NiF0g8iJ"
                    className="absolute w-full h-full left-0 top-0 -z-10"
                ></div>
            </div>
            <Script
                src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js"
                onLoad={() => {
                    if (window.UnicornStudio) {
                        window.UnicornStudio.init();
                    }
                }}
                strategy="afterInteractive"
            />
            <div className="fixed inset-0 z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        </div>
    );
}

declare global {
    interface Window {
        UnicornStudio: any;
    }
}
