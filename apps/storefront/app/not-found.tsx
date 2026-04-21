"use client";

import Link from "next/link";

import type { Metadata } from "next";



/**
 * Storefront 404 page (item 1.3 — post_v03_debrief.md).
 * Shown when a product slug or shop slug doesn't exist.
 * Next.js automatically serves this when notFound() is called.
 */
export default function StorefrontNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Brand mark */}
        <div className="flex justify-center mb-8">
          <div className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold select-none">
            ন
          </div>
        </div>

        <h1 className="text-6xl font-bold text-foreground tabular-nums mb-4">
          404
        </h1>

        <h2 className="text-xl font-semibold text-foreground mb-3">
          Page not found
        </h2>

        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          The product or page you're looking for doesn't exist, has been
          removed, or the URL might be wrong.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to storefront
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Go back
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-10">
          Powered by{" "}
          <span className="font-medium text-foreground">Nishchinto</span>
        </p>
      </div>
    </main>
  );
}
