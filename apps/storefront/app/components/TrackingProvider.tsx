"use client";

/**
 * TrackingProvider
 *
 * Injects third-party analytics scripts based on the shop's tracking config.
 * Must be a Client Component because next/script requires it.
 *
 * Scripts are conditionally loaded — no script injected if the ID is empty.
 * This keeps the storefront clean for merchants on the Free plan.
 */
import Script from "next/script";
import type { ShopTrackingConfig } from "@repo/api";

interface TrackingProviderProps {
  config: ShopTrackingConfig;
}

export function TrackingProvider({ config }: TrackingProviderProps) {
  const { fb_pixel_id, ga4_measurement_id, gtm_id } = config;

  return (
    <>
      {/* ── Facebook Pixel ─────────────────────────────────────────────── */}
      {fb_pixel_id && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fb_pixel_id}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${fb_pixel_id}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ── Google Analytics 4 ─────────────────────────────────────────── */}
      {ga4_measurement_id && (
        <>
          <Script
            id="ga4-gtag"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4_measurement_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4_measurement_id}', {
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}

      {/* ── Google Tag Manager ─────────────────────────────────────────── */}
      {gtm_id && (
        <>
          <Script id="gtm-head" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtm_id}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtm_id}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}
    </>
  );
}
