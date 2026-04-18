import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStorefrontProduct } from "@repo/api";

interface ProductDetailPageProps {
  params: Promise<{ shop: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { shop, slug } = await params;
  const res = await getStorefrontProduct(shop, slug);
  if (!res.success) return { title: "Product Not Found" };

  const product = res.data;
  const thumbnail =
    product.product_media.find((m) => m.is_thumbnail)?.media.cdn_url ??
    product.product_media[0]?.media.cdn_url;

  return {
    title: product.seo_title || product.name,
    description:
      product.seo_description ||
      product.description.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      type: "website",
      title: product.seo_title || product.name,
      description:
        product.seo_description ||
        product.description.replace(/<[^>]*>/g, "").slice(0, 160),
      images: thumbnail ? [{ url: thumbnail, width: 1200, height: 630 }] : [],
    },
  };
}

function formatPrice(price: string) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(parseFloat(price));
}

export default async function StorefrontProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { shop, slug } = await params;
  const res = await getStorefrontProduct(shop, slug);

  if (!res.success) notFound();

  const product = res.data;
  const thumbnail =
    product.product_media.find((m) => m.is_thumbnail)?.media.cdn_url ??
    product.product_media[0]?.media.cdn_url;

  const sortedMedia = [...product.product_media].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const isOutOfStock = product.status === "OUT_OF_STOCK" || product.total_stock === 0;

  // Unique attribute names for variant selection UI
  const attr1Name = product.variants[0]?.attribute_name_1;
  const attr2Name = product.variants[0]?.attribute_name_2;
  const attr1Values = [...new Set(product.variants.map((v) => v.attribute_value_1).filter(Boolean))];
  const attr2Values = [...new Set(product.variants.map((v) => v.attribute_value_2).filter(Boolean))];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Breadcrumb ────────────────────────────────────────── */}
        <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
          <Link href={`/${shop}/products`} className="hover:underline">
            Products
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                href={`/${shop}/products?category=${product.category.slug}`}
                className="hover:underline"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── Image Gallery ─────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="size-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute top-4 left-4">
                  <span className="bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full border">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails strip */}
            {sortedMedia.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sortedMedia.map((pm) => (
                  <div
                    key={pm.id}
                    className="relative size-20 shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer"
                  >
                    <Image
                      src={pm.media.cdn_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ──────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Name & Category */}
            <div>
              {product.category && (
                <Link
                  href={`/${shop}/products?category=${product.category.slug}`}
                  className="text-sm text-muted-foreground hover:underline mb-1 inline-block"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.sku && (
                <p className="text-sm text-muted-foreground mt-1">
                  SKU: <code className="font-mono">{product.sku}</code>
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(product.base_price)}
              </span>
              {product.compare_at_price && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
              {product.compare_at_price && (
                <span className="text-sm font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                  {Math.round(
                    (1 -
                      parseFloat(product.base_price) /
                        parseFloat(product.compare_at_price)) *
                      100,
                  )}
                  % off
                </span>
              )}
            </div>

            {/* Variant selection (browse-only in v0.3 — no cart) */}
            {attr1Name && attr1Values.length > 0 && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">{attr1Name}</p>
                  <div className="flex flex-wrap gap-2">
                    {attr1Values.map((val) => (
                      <button
                        key={val}
                        className="px-4 py-2 rounded-lg border text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                {attr2Name && attr2Values.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">{attr2Name}</p>
                    <div className="flex flex-wrap gap-2">
                      {attr2Values.map((val) => (
                        <button
                          key={val}
                          className="px-4 py-2 rounded-lg border text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-sm">
              {isOutOfStock ? (
                <span className="text-destructive font-medium">● Out of stock</span>
              ) : product.total_stock <= 5 ? (
                <span className="text-amber-600 font-medium">
                  ● Only {product.total_stock} left
                </span>
              ) : (
                <span className="text-emerald-600 font-medium">● In stock</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Shipping info */}
            {!product.is_digital && product.weight_grams && (
              <div className="text-sm text-muted-foreground border-t pt-4">
                <p>Weight: {product.weight_grams}g</p>
                {product.length_cm && product.width_cm && product.height_cm && (
                  <p>
                    Dimensions: {product.length_cm} × {product.width_cm} ×{" "}
                    {product.height_cm} cm
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
