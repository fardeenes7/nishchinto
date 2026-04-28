"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

/**
 * Cross-Domain SSO Tracker
 * Injected exclusively into storefront and dashboard interfaces to
 * handshake with auth.mohajon.io (the centralized source of truth).
 */
export function SSOHandshakeIframe() {
    useEffect(() => {
        // Listen for cross-domain identity updates (e.g. from central auth node)
        const handleMessage = (event: MessageEvent) => {
            // Security Check: Lock down to internal root origin
            if (typeof window !== "undefined") {
                const originWhitelist = [
                    "https://auth.mohajon.io",
                    "http://localhost:3000"
                ];

                if (!originWhitelist.includes(event.origin)) return;

                if (event.data?.type === "SSO_TOKEN_SYNC") {
                    // Establish identical session persistence locally for the sub-domain
                    Cookies.set("mohajon_jwt", event.data.token, {
                        expires: 1,
                        domain: window.location.hostname
                    });
                    console.log("[SSO] Local identity synced seamlessly.");
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <iframe
            src={
                process.env.NEXT_PUBLIC_AUTH_URL ||
                "https://auth.mohajon.io/sso-hub"
            }
            style={{ display: "none", width: 0, height: 0 }}
            title="auth-sso"
        />
    );
}
