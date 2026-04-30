import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import {
    ArrowRight,
    PlayCircle,
    Share2,
    Sparkles,
    TrendingUp,
    Store,
    Bot,
    CheckCircle2,
    Package,
    MessageCircle
} from "lucide-react";

export function Hero({ dict }: { dict: any }) {
    return (
        <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[0%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                    {/* Left content block */}
                    <div className="flex flex-col gap-8 text-center lg:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-4 self-center lg:self-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Badge
                                variant="secondary"
                                className="px-4 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 font-semibold text-sm"
                            >
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                {dict.hero.trust_badge}
                            </Badge>
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                🌟 {dict.hero.tagline}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight lg:leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {dict.hero.title
                                .split(" ")
                                .map((word: string, i: number) =>
                                    [
                                        "Sales",
                                        "Channels",
                                        "One",
                                        "Place",
                                        "Manage"
                                    ].includes(word) ? (
                                        <span
                                            key={i}
                                            className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60"
                                        >
                                            {word}{" "}
                                        </span>
                                    ) : (
                                        `${word} `
                                    )
                                )}
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-900 font-medium">
                            {dict.hero.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <Button
                                asChild
                                size="lg"
                                className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 rounded-full group"
                            >
                                <Link href="#waitlist">
                                    {dict.hero.cta_primary}
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 text-lg font-semibold rounded-full hover:bg-muted/50 transition-all duration-300 bg-background/50 backdrop-blur-sm border-border/60"
                            >
                                <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                                {dict.hero.cta_secondary}
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8 opacity-70 animate-in fade-in duration-1000 delay-300">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                                Integrated with
                            </span>
                            <div className="flex flex-wrap gap-6 items-center">
                                <span className="font-black text-xl tracking-tighter hover:text-primary transition-colors cursor-pointer opacity-80 hover:opacity-100">
                                    bKash
                                </span>
                                <span className="font-black text-xl tracking-tighter hover:text-primary transition-colors cursor-pointer opacity-80 hover:opacity-100">
                                    Pathao
                                </span>
                                <span className="font-black text-xl tracking-tighter hover:text-primary transition-colors cursor-pointer opacity-80 hover:opacity-100">
                                    Steadfast
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Abstract UI Composition */}
                    <div className="w-full relative lg:ml-auto flex items-center justify-center animate-in zoom-in-95 fade-in duration-1000 delay-500 min-h-[500px] lg:min-h-[600px] mt-12 lg:mt-0">
                        {/* Core glow */}
                        <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent rounded-full blur-[100px] opacity-60" />

                        <div className="relative w-full h-full max-w-[500px] perspective-[1000px] hover:rotate-0 transition-transform duration-700 ease-out lg:rotate-y-[-10deg] lg:rotate-x-[5deg]">
                            {/* Main Dashboard Card */}
                            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[460px] shadow-2xl shadow-primary/5 border-border/40 bg-background/70 backdrop-blur-2xl z-20 overflow-hidden group hover:border-primary/30 transition-all duration-500">
                                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-primary/40" />
                                <CardHeader className="pb-4 border-b border-border/40 bg-muted/10">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Store className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold">
                                                    Mohajon Storefront
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    mohajon.store/demo
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0.5"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                            Online
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 grid gap-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 p-4 rounded-xl border border-border/40 bg-background/60 shadow-sm hover:shadow-md transition-shadow group-hover:border-primary/20">
                                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                                                <TrendingUp className="w-4 h-4 text-primary" />
                                                Total Sales
                                            </div>
                                            <div className="text-2xl font-bold tracking-tight">
                                                ৳ 48.5K
                                            </div>
                                            <div className="text-[10px] text-green-500 font-bold bg-green-500/10 w-fit px-1.5 py-0.5 rounded-sm">
                                                +12.5% this week
                                            </div>
                                        </div>
                                        <div className="space-y-2 p-4 rounded-xl border border-border/40 bg-background/60 shadow-sm hover:shadow-md transition-shadow group-hover:border-primary/20">
                                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                                                <Package className="w-4 h-4 text-primary" />
                                                Active Orders
                                            </div>
                                            <div className="text-2xl font-bold tracking-tight">
                                                124
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-semibold">
                                                12 pending dispatch
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity Mock */}
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Recent Activity
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <MessageCircle className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold">
                                                    New Order via FB
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    bKash paid • #ORD-089
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold">
                                                ৳ 1,250
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Floating Chatbot Card */}
                            <Card className="absolute -right-6 md:-right-16 top-0 md:top-12 w-[260px] shadow-2xl shadow-primary/5 border-border/40 bg-background/80 backdrop-blur-2xl z-30 animate-[bounce_6s_infinite]">
                                <CardContent className="p-4 flex gap-3">
                                    <Avatar className="h-10 w-10 border border-primary/20 bg-primary/5 shadow-inner">
                                        <AvatarFallback className="bg-transparent">
                                            <Bot className="w-5 h-5 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold flex items-center gap-1">
                                            AI Agent{" "}
                                            <Sparkles className="w-3 h-3 text-primary fill-primary/20" />
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Confirmed Order #089. Sent invoice
                                            to customer via Messenger.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Floating Social Sync Card */}
                            <Card className="absolute -left-6 md:-left-16 bottom-10 md:bottom-20 w-[240px] shadow-2xl shadow-primary/5 border-border/40 bg-background/80 backdrop-blur-2xl z-30 animate-[bounce_5s_infinite_reverse]">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                                        <Share2 className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">
                                            Facebook Catalog
                                        </p>
                                        <p className="text-xs text-green-500 flex items-center font-semibold">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                                            150 SKUs Synced
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Decorative Elements */}
                            <div className="absolute top-10 right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse delay-700" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
