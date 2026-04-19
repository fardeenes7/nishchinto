"use client";

import { useEffect } from "react";
import type { Metadata } from "next";

/**
 * Storefront runtime error boundary (item 1.3 — post_v03_debrief.md).
 *
 * This is a Client Component — Next.js requires it so the error boundary
 * can access React's lifecycle to reset state.
 *
 * IMPORTANT: Stack traces are NEVER exposed in production (process.env.NODE_ENV
 * check below). Only a generic message is shown to customers.
 */
export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev; in production this would ship to Sentry/OpenTelemetry
    if (process.env.NODE_ENV !== "production") {
      console.error("[StorefrontError]", error);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Brand mark */}
        <div className="flex justify-center mb-8">
          <div className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold select-none">
            ন
          </div>
        </div>

        <h1 className="text-xl font-semibold text-foreground mb-3">
          Something went wrong
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          We encountered an unexpected error while loading this page.
          Please try again in a moment.
        </p>

        {/* Digest — safe to show (it's an opaque ID, no stack trace) */}
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Go to storefront
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-10">
          Powered by{" "}
          <span className="font-medium text-foreground">Nishchinto</span>
        </p>
      </div>
    </main>
  );
}
