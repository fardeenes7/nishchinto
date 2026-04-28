/**
 * Claim Page — Server Component shell
 *
 * Reads `token` from searchParams on the server (async API in Next.js 16).
 * Passes it as a plain string prop to the Client Component form.
 * This avoids the CSR-bailout that `useSearchParams()` causes.
 */

import { Suspense } from "react";
import { ClaimForm } from "./_components/ClaimForm";

export const metadata = {
    title: "Claim Your Shop — Mohajon",
    description:
        "Set up your subdomain and password to activate your Mohajon store."
};

interface ClaimPageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function ClaimPage({ searchParams }: ClaimPageProps) {
    // Next.js 16: searchParams is async — must be awaited
    const { token } = await searchParams;

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
            <div className="max-w-md w-full bg-background border rounded-lg shadow-sm p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Claim Your Shop</h1>
                    <p className="text-muted-foreground text-sm mt-2">
                        Choose your unique subdomain and set a password to
                        activate your store.
                    </p>
                </div>
                {/* Suspense is required here because ClaimForm uses client hooks */}
                <Suspense
                    fallback={
                        <div className="text-center text-muted-foreground">
                            Loading...
                        </div>
                    }
                >
                    <ClaimForm token={token ?? ""} />
                </Suspense>
            </div>
        </main>
    );
}
