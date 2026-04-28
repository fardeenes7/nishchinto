import React from "react";
import { StorefrontShop } from "@repo/api";

interface ThemeProps {
    id?: string;
    theme_id?: string;
    aesthetic_overrides?: any;
    active_components?: {
        header?: string;
        hero?: string;
        product_showcase?: string;
        pdp?: string;
        footer?: string;
    };
    typography?: any;
}

interface BlockRendererProps {
    theme: ThemeProps | null;
    shopInfo: StorefrontShop;
}

export function BlockRenderer({ theme, shopInfo }: BlockRendererProps) {
    // Fallbacks if no theme or missing components
    const headerVariant = theme?.active_components?.header || "classic";
    const heroVariant = theme?.active_components?.hero || "split_media";
    const showcaseVariant =
        theme?.active_components?.product_showcase || "grid";
    const footerVariant = theme?.active_components?.footer || "simple";

    return (
        <>
            <HeaderBlock variant={headerVariant} shopName={shopInfo.name} />
            <main className="flex-1">
                <HeroBlock variant={heroVariant} shopName={shopInfo.name} />
                <ProductShowcaseBlock
                    variant={showcaseVariant}
                    shopSlug={shopInfo.subdomain}
                />
            </main>
            <FooterBlock variant={footerVariant} shopName={shopInfo.name} />
        </>
    );
}

function HeaderBlock({
    variant,
    shopName
}: {
    variant: string;
    shopName: string;
}) {
    if (variant === "minimal") {
        return (
            <header className="border-b h-14 flex items-center justify-between px-6">
                <div className="text-xl font-bold">{shopName}</div>
                <button className="p-2">Menu</button>
            </header>
        );
    }
    if (variant === "center_logo") {
        return (
            <header className="border-b h-20 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold tracking-widest">
                    {shopName}
                </div>
                <nav className="text-sm space-x-6 mt-2 text-muted-foreground">
                    <a href="#">Home</a>
                    <a href="#">Shop</a>
                    <a href="#">About</a>
                </nav>
            </header>
        );
    }
    // Classic Navigation
    return (
        <header className="border-b h-16 flex items-center justify-between px-8 bg-card text-card-foreground">
            <div className="text-xl font-bold">{shopName}</div>
            <nav className="space-x-6 text-sm font-medium">
                <a href="#">Products</a>
                <a href="#">Categories</a>
            </nav>
            <div>
                <button className="text-sm font-medium">Cart (0)</button>
            </div>
        </header>
    );
}

function HeroBlock({
    variant,
    shopName
}: {
    variant: string;
    shopName: string;
}) {
    if (variant === "full_overlay") {
        return (
            <section className="h-[60vh] bg-slate-900 text-white flex flex-col items-center justify-center text-center p-8 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center">
                <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm">
                    <h1 className="text-5xl font-extrabold mb-4">{shopName}</h1>
                    <p className="text-lg opacity-80 max-w-xl">
                        Welcome to our official store. Discover the best
                        products handpicked for you.
                    </p>
                </div>
            </section>
        );
    }
    if (variant === "minimal_typography") {
        return (
            <section className="py-32 px-8 max-w-4xl mx-auto text-center">
                <h1 className="text-6xl font-light tracking-tighter mb-6">
                    {shopName}.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Curated essentials for your everyday life. We focus on
                    quality and timeless design.
                </p>
            </section>
        );
    }
    // Split Media
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
            <div className="flex flex-col justify-center p-12 lg:p-24 bg-muted/30">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    Welcome to {shopName}
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Discover our latest collection. High quality products
                    tailored for your needs.
                </p>
                <div>
                    <button className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium">
                        Shop Now
                    </button>
                </div>
            </div>
            <div className="bg-muted flex items-center justify-center overflow-hidden">
                <div className="text-muted-foreground/50 font-mono">
                    Hero Image Placeholder
                </div>
            </div>
        </section>
    );
}

function ProductShowcaseBlock({
    variant,
    shopSlug
}: {
    variant: string;
    shopSlug: string;
}) {
    // In reality, this would fetch products via ISR or use a client component for infinite scroll
    const placeholders = [1, 2, 3, 4, 5, 6, 7, 8];

    if (variant === "carousel") {
        return (
            <section className="py-16 overflow-hidden pl-8">
                <h2 className="text-2xl font-bold mb-8 px-4">
                    Featured Products
                </h2>
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                    {placeholders.slice(0, 5).map((i) => (
                        <div
                            key={i}
                            className="min-w-[300px] snap-start group cursor-pointer"
                        >
                            <div className="aspect-square bg-muted rounded-lg mb-4 group-hover:opacity-90 transition"></div>
                            <div className="font-medium">Product Name {i}</div>
                            <div className="text-muted-foreground text-sm">
                                ৳ 1,200
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (variant === "masonry") {
        return (
            <section className="py-16 px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 text-center">
                    Our Collection
                </h2>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {placeholders.map((i) => (
                        <div
                            key={i}
                            className={`bg-muted rounded-xl break-inside-avoid ${i % 3 === 0 ? "aspect-3/4" : "aspect-square"} hover:scale-[1.02] transition-transform cursor-pointer`}
                        ></div>
                    ))}
                </div>
            </section>
        );
    }

    // Grid
    return (
        <section className="py-16 px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">New Arrivals</h2>
                <a href="#" className="text-sm font-medium hover:underline">
                    View All &rarr;
                </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {placeholders.map((i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="aspect-4/5 bg-muted rounded-lg mb-4 overflow-hidden">
                            <div className="w-full h-full bg-secondary/50 group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">
                                    Premium Item {i}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Variant Name
                                </p>
                            </div>
                            <span className="font-semibold">৳ 1,{i}00</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FooterBlock({
    variant,
    shopName
}: {
    variant: string;
    shopName: string;
}) {
    if (variant === "expanded") {
        return (
            <footer className="bg-slate-900 text-slate-300 py-16 px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {shopName}
                        </h3>
                        <p className="text-sm opacity-80 leading-relaxed mb-6">
                            High quality products delivered right to your door.
                            Secure payments and fast shipping.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-white">
                                    All Products
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    New Arrivals
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Discounts
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">
                            Support
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-white">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Shipping & Returns
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">
                            Newsletter
                        </h4>
                        <p className="text-sm mb-4">
                            Subscribe to get special offers and updates.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-slate-800 px-3 py-2 rounded text-sm w-full outline-none focus:ring-1 ring-primary"
                            />
                            <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-sm text-center">
                    &copy; {new Date().getFullYear()} {shopName}. All rights
                    reserved.
                </div>
            </footer>
        );
    }

    // Simple
    return (
        <footer className="border-t py-12 px-8 text-center text-muted-foreground">
            <h3 className="font-bold text-foreground mb-4">{shopName}</h3>
            <div className="flex justify-center gap-6 text-sm mb-8">
                <a href="#" className="hover:text-foreground">
                    Terms
                </a>
                <a href="#" className="hover:text-foreground">
                    Privacy
                </a>
                <a href="#" className="hover:text-foreground">
                    Refund Policy
                </a>
            </div>
            <p className="text-xs">
                &copy; {new Date().getFullYear()} {shopName}. Powered by
                Mohajon.
            </p>
        </footer>
    );
}
