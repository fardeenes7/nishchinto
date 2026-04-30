import en from "@/dictionaries/en.json";
import bn from "@/dictionaries/bn.json";
import Link from "next/link";
import { SSOHandshakeIframe } from "@repo/ui/components/SSOHandshake";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Button } from "@repo/ui/components/ui/button";
import { ShoppingBag, Share2, Sparkles, CheckCircle2 } from "lucide-react";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { Trust } from "./Trust";
import { Waitlist } from "./Waitlist";
import { PricingTeaser } from "./PricingTeaser";
import { Logo } from "@repo/ui/components/Logo";
import WhyWeAreDifferent from "./why-we-are-different";
import Faq from "@/components/faq";
import CTA from "@/components/cta";

const dictionaries = { en, bn };

export default async function LandingPage({
    params
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict =
        dictionaries[lang as keyof typeof dictionaries] ?? dictionaries.bn;

    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <SSOHandshakeIframe />

            {/* Header */}

            {/* Hero Section */}
            <Hero dict={dict} />

            {/* Features Section */}
            <Features dict={dict} />

            <WhyWeAreDifferent dict={dict} />

            <PricingTeaser dict={dict} lang={lang} />

            {/* Trust Section */}
            <Trust dict={dict} />

            <Faq dict={dict} />

            <CTA dict={dict} />
        </main>
    );
}
