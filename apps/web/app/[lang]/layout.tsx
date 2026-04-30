import "@repo/ui/globals.css";
import { Metadata } from "next";
import { Inter, Baloo_Da_2, Hind_Siliguri } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import Footer from "./footer";
import en from "@/dictionaries/en.json";
import bn from "@/dictionaries/bn.json";
import Header from "./header";

const dictionaries = { en, bn };

const inter = Inter({ subsets: ["latin"] });
const baloo = Baloo_Da_2({});
const hind = Hind_Siliguri({
    weight: "400"
});

export const metadata: Metadata = {
    title: "Mohajon | Secure SaaS for Local Merchants",
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
        title: "Mohajon SaaS Platform",
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
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    const dict =
        dictionaries[lang as keyof typeof dictionaries] ?? dictionaries.bn;

    return (
        <html lang={lang} suppressHydrationWarning>
            {gtmId && <GoogleTagManager gtmId={gtmId} />}
            <body className={`${hind.className} ${inter.className}`}>
                <Header dict={dict} lang={lang} />
                {children}
                <Footer dict={dict} lang={lang} />
            </body>
        </html>
    );
}
