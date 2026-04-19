import en from "@/dictionaries/en.json";
import bn from "@/dictionaries/bn.json";
import Link from "next/link";
import { SSOHandshakeIframe } from "@repo/ui/components/SSOHandshake";
import { WaitlistForm } from "../../components/WaitlistForm";
import { AffiliateFooter } from "../../components/AffiliateFooter";
import { Logo } from "@repo/ui/components/Logo";
import { Button } from "@repo/ui/components/ui/button";
import { ShoppingBag, Share2, Sparkles, CheckCircle2 } from "lucide-react";

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
            <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href={`/${lang}`} className="flex items-center gap-2">
                        <Logo width={32} height={32} />
                        <span className="text-xl font-bold tracking-tight">Nishchinto</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="#features" className="hover:text-primary transition-colors">{dict.nav.features}</Link>
                        <Link href="#pricing" className="hover:text-primary transition-colors">{dict.nav.pricing}</Link>
                        <Button asChild variant="default" size="sm">
                            <Link href="#waitlist">{dict.nav.waitlist}</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,var(--color-primary)_0%,transparent_100%)] opacity-10"></div>
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                        <Sparkles className="w-4 h-4" />
                        <span>{dict.hero.tagline}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance">
                        {dict.hero.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 text-pretty">
                        {dict.hero.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="h-14 px-8 text-lg font-bold">
                            <Link href="#waitlist">{dict.hero.cta}</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                            {dict.nav.features}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{dict.features.title}</h2>
                        <p className="text-lg text-muted-foreground">{dict.features.subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <ShoppingBag className="w-8 h-8" />, ...dict.features.items[0] },
                            { icon: <Share2 className="w-8 h-8" />, ...dict.features.items[1] },
                            { icon: <Sparkles className="w-8 h-8" />, ...dict.features.items[2] }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-background border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 border-y">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold mb-12 opacity-50">{dict.trust.title}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
                        {/* Placeholder logos for visual flair */}
                        <div className="text-2xl font-black">STORE.ONE</div>
                        <div className="text-2xl font-black">LOCAL.BIZ</div>
                        <div className="text-2xl font-black">GROW.DEV</div>
                        <div className="text-2xl font-black">FAST.SELL</div>
                    </div>
                </div>
            </section>

            {/* Waitlist Section */}
            <section id="waitlist" className="py-24 md:py-32 bg-primary text-primary-foreground">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">{dict.waitlist.title}</h2>
                            <p className="text-xl opacity-90 mb-8">{dict.waitlist.subtitle}</p>
                            <ul className="space-y-4">
                                {["Early access to premium features", "Dedicated onboarding support", "Special beta-launch pricing"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-background text-foreground p-8 md:p-10 rounded-3xl shadow-2xl">
                            <WaitlistForm />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Logo width={24} height={24} className="opacity-50" />
                        <span className="font-bold opacity-50">Nishchinto</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Nishchinto. {dict.footer.all_rights}
                    </p>
                    <AffiliateFooter isForceAffiliate={true} />
                </div>
            </footer>
        </main>
    );
}
