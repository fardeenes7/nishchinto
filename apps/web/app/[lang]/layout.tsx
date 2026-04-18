import "@repo/ui/globals.css";
import { Metadata } from "next";
import { Inter, Baloo_Da_2 } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const baloo = Baloo_Da_2({});

export const metadata: Metadata = {
    title: "Nishchinto | Secure SaaS for Local Merchants",
    description: "Launch your high-performance online store instantly.",
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon.ico", sizes: "any" }
        ],
        apple: "/apple-touch-icon.png"
    },
    manifest: "/site.webmanifest",
    openGraph: {
        title: "Nishchinto SaaS Platform",
        description: "Empowering local merchants with scalable eCommerce."
    }
};

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    return (
        <html lang={lang} suppressHydrationWarning>
            <body className={`${baloo.className} ${inter.className}`}>
                {/* We would dynamically inject GTM here using an env var later */}
                {children}
            </body>
        </html>
    );
}
