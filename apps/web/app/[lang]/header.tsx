import { Logo } from "@repo/ui/components/Logo";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

export default function Header({ dict, lang }: { dict: any; lang: string }) {
    return (
        <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-background/60 backdrop-blur-xl border-b border-border/40">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link
                    href={lang === "bn" ? "/" : `/${lang}`}
                    className="flex items-center gap-2.5 group"
                >
                    <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Logo
                            width={24}
                            height={24}
                            className="text-primary-foreground"
                        />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                        Mohajon
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-10 text-sm font-semibold">
                    <Link
                        href="#features"
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        {dict.nav.features}
                    </Link>
                    <Link
                        href={lang === "bn" ? "/pricing" : `/${lang}/pricing`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        {dict.nav.pricing}
                    </Link>
                    <Button
                        asChild
                        variant="default"
                        size="sm"
                        className="h-10 px-5 rounded-full font-bold"
                    >
                        <Link href="#waitlist">{dict.nav.waitlist}</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
