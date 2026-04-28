import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { CrashReporter } from "@/components/CrashReporter";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-sans"
});

export const metadata: Metadata = {
    title: "Mohajon Dashboard",
    description: "ব্যবসা হোক নিশ্চিন্তে — Seller Dashboard",
    icons: {
        icon: "/favicon.ico"
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={outfit.variable} suppressHydrationWarning>
            <body>
                {children}
                <CrashReporter />
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}
