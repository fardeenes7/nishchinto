/**
 * Storefront dynamic OG image route.
 *
 * Spec (phase_0_3_detailed_plan.md + post_v03_debrief.md item 1.2):
 *   - Query params: ?title=&price=&image_url=&shop_name=
 *   - Title truncated at 120 characters (hard rule)
 *   - Fallback: branded placeholder if image_url is absent or fails
 *   - Response: ImageResponse — 1200×630px
 *   - Uses brand colors from the bdKVNSPC preset (neutral palette)
 *
 * Usage in generateMetadata:
 *   openGraph: {
 *     images: [`/api/og?title=${encodeURIComponent(name)}&price=${price}&shop_name=${shop}`],
 *   }
 */

import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const TITLE_MAX_CHARS = 120; // Hard rule from spec

// Brand palette — mirrors the bdKVNSPC preset's neutral/primary tokens
const COLORS = {
  background: "#0a0a0a",
  surface: "#141414",
  border: "#262626",
  primary: "#e8e8e8",
  secondary: "#a3a3a3",
  accent: "#d4a855", // warm gold — Nishchinto accent
  muted: "#525252",
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(num);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const rawTitle = searchParams.get("title") ?? "Untitled Product";
  const price = searchParams.get("price") ?? "";
  const imageUrl = searchParams.get("image_url") ?? "";
  const shopName = searchParams.get("shop_name") ?? "Nishchinto Store";

  const title = truncate(rawTitle, TITLE_MAX_CHARS);
  const formattedPrice = formatPrice(price);

  // Validate the image URL to prevent SSRF — only allow http/https URLs
  let validImageUrl: string | null = null;
  if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
    validImageUrl = imageUrl;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: OG_WIDTH,
          height: OG_HEIGHT,
          display: "flex",
          flexDirection: "row",
          backgroundColor: COLORS.background,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        }}
      >
        {/* ── Left: Product Image ─────────────────────────────────────────── */}
        <div
          style={{
            width: OG_HEIGHT, // square
            height: OG_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.surface,
            borderRight: `1px solid ${COLORS.border}`,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {validImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={validImageUrl}
              alt=""
              width={OG_HEIGHT}
              height={OG_HEIGHT}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            /* Branded placeholder */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              {/* Nishchinto ন mark */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  backgroundColor: COLORS.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 44,
                  color: COLORS.background,
                  fontWeight: 700,
                }}
              >
                ন
              </div>
              <span
                style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}
              >
                No image
              </span>
            </div>
          )}
        </div>

        {/* ── Right: Product Info ─────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 60px",
            overflow: "hidden",
          }}
        >
          {/* Shop name badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.accent,
                color: COLORS.background,
                fontSize: 13,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 100,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              {shopName}
            </div>
          </div>

          {/* Product title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 60 ? 36 : 48,
                fontWeight: 700,
                color: COLORS.primary,
                lineHeight: 1.2,
                margin: 0,
                wordBreak: "break-word",
              }}
            >
              {title}
            </h1>

            {formattedPrice && (
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: COLORS.accent,
                  letterSpacing: "-0.02em",
                }}
              >
                {formattedPrice}
              </span>
            )}
          </div>

          {/* Footer: Powered by Nishchinto */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: COLORS.muted,
              fontSize: 13,
              borderTop: `1px solid ${COLORS.border}`,
              paddingTop: 20,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                backgroundColor: COLORS.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.background,
              }}
            >
              ন
            </div>
            <span>Powered by Nishchinto</span>
          </div>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    },
  );
}
