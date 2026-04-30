"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Field, FieldDescription } from "@repo/ui/components/ui/field";
import { Button } from "@repo/ui/components/ui/button";

/* ─────────────────────────────────────────────
   Google SVG Logo
───────────────────────────────────────────── */
const GoogleLogo = () => (
    <svg className="google-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

/* ─────────────────────────────────────────────
   Shield icon for logo
───────────────────────────────────────────── */
const ShieldIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

/* ─────────────────────────────────────────────
   Lock icon for trust strip
───────────────────────────────────────────── */
const LockIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

/* ─────────────────────────────────────────────
   Main login content (needs Suspense for useSearchParams)
───────────────────────────────────────────── */
export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/";

    const handleGoogleLogin = () => {
        setLoading(true);
        signIn("google", { callbackUrl: returnUrl });
    };

    return (
        <form className={"flex flex-col gap-6"}>
            <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-sm text-balance text-muted-foreground">
                    Sign in to your mohajon dashboard.
                </p>
            </div>

            <Field className="gap-6">
                <Button
                    variant="outline"
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    aria-label="Sign in with Google"
                >
                    <span className="btn-shine" aria-hidden="true" />
                    {loading ? (
                        <Loader2
                            style={{
                                width: 20,
                                height: 20,
                                animation: "spin 1s linear infinite"
                            }}
                            aria-hidden="true"
                        />
                    ) : (
                        <GoogleLogo />
                    )}
                    {loading ? "Signing you in…" : "Continue with Google"}
                </Button>
                <FieldDescription className="text-center">
                    By continuing, you agree to our{" "}
                    <a
                        href="https://www.mohajon.io/terms-of-service"
                        aria-label="Terms of Service"
                    >
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://www.mohajon.io/privacy-policy"
                        aria-label="Privacy Policy"
                    >
                        Privacy Policy
                    </a>
                    .
                </FieldDescription>
            </Field>
        </form>
    );

    return (
        <div className="login-shell">
            <div className="login-card" role="main">
                {/* Logo */}
                <div className="logo-wrap">
                    <div className="logo-icon">
                        <ShieldIcon />
                    </div>
                    <span className="logo-name">Mohajon</span>
                    <span className="logo-badge">Seller</span>
                </div>

                {/* Heading */}
                <div className="login-heading">
                    <h1>
                        Welcome back,
                        <br />
                        <span>let&apos;s get you in.</span>
                    </h1>
                </div>
                <p className="login-sub">
                    Sign in to your seller dashboard to manage inventory, track
                    analytics, and grow your business.
                </p>

                {/* Divider */}
                <div className="login-divider">
                    <div className="login-divider-line" />
                    <span>Continue with</span>
                    <div className="login-divider-line" />
                </div>

                {/* Google CTA */}
                <button id="google-login-btn" className="google-btn">
                    <span className="btn-shine" aria-hidden="true" />
                    {loading ? (
                        <Loader2
                            style={{
                                width: 20,
                                height: 20,
                                animation: "spin 1s linear infinite"
                            }}
                            aria-hidden="true"
                        />
                    ) : (
                        <GoogleLogo />
                    )}
                    {loading ? "Signing you in…" : "Continue with Google"}
                </button>

                {/* Trust strip */}
                <div
                    className="trust-strip"
                    role="note"
                    aria-label="Security notice"
                >
                    <LockIcon />
                    <span>
                        End-to-end encrypted · Google OAuth 2.0 · No passwords
                        stored
                    </span>
                </div>

                {/* Footer */}
            </div>
        </div>
    );
}
