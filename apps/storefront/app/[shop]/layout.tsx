import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStorefrontTrackingConfig, getStorefrontTheme } from "@/lib/api";

import { TrackingProvider } from "../components/TrackingProvider";
import { ThemeTokenProvider } from "../components/ThemeTokenProvider";

interface ShopLayoutProps {
    children: React.ReactNode;
    params: Promise<{ shop: string }>;
}

export async function generateMetadata({
    params
}: ShopLayoutProps): Promise<Metadata> {
    const { shop } = await params;
    return {
        // Storefront-level metadata — overridden by individual product pages
        metadataBase: new URL(`https://${shop}.mohajon.store`),
        title: {
            default: `${shop} — Powered by Mohajon`,
            template: `%s | ${shop}`
        }
    };
}

export default async function ShopLayout({
    children,
    params
}: ShopLayoutProps) {
    const { shop } = await params;

    const trackingRes = await getStorefrontTrackingConfig(shop);
    const trackingConfig = trackingRes.success
        ? trackingRes.data
        : {
              id: "",
              fb_pixel_id: "",
              ga4_measurement_id: "",
              gtm_id: "",
              updated_at: ""
          };

    const themeRes = await getStorefrontTheme(shop);
    const themeData = themeRes.success ? themeRes.data : null;

    return (
        <>
            <ThemeTokenProvider theme={themeData} />
            {/* Inject marketing pixels — only renders scripts if IDs are present */}
            <TrackingProvider config={trackingConfig} />
            {children}
        </>
    );
}
