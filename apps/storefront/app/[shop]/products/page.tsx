import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStorefrontProducts, getCategories } from "@repo/api";
import { publicFetch } from "@repo/api";

interface ShopProductsPageProps {
  params: Promise<{ shop: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({
  params,
}: ShopProductsPageProps): Promise<Metadata> {
  const { shop } = await params;
  return {
    title: `Products`,
    description: `Browse all products from ${shop}.`,
    openGraph: {
      type: "website",
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

export default async function ShopProductsPage({
  params,
  searchParams,
}: ShopProductsPageProps) {
  const { shop } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");

  const res = await getStorefrontProducts(shop, {
    category: sp.category,
    page,
    page_size: 24,
  });

  if (!res.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Shop not found or unavailable.</p>
      </div>
    );
  }

  const { results: products, count, num_pages } = res.data;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Header ───────────────────────────────────────────── */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Our Products</h1>
          <p className="mt-2 text-muted-foreground">
            {count} product{count !== 1 ? "s" : ""} available
          </p>
        </header>

        {/* ── Product Grid ──────────────────────────────────────── */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No products available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/${shop}/products/${product.slug}`}
                className="group flex flex-col gap-3"
              >
                {/* Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-muted-foreground text-xs">
                      No image
                    </div>
                  )}
                  {product.status === "OUT_OF_STOCK" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.compare_at_price && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                        Sale
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <h2 className="font-medium text-sm leading-snug line-clamp-2 group-hover:underline">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {formatPrice(product.base_price)}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Pagination ────────────────────────────────────────── */}
        {num_pages > 1 && (
          <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Product pagination"
          >
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: num_pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`?page=${p}`}
                className={`w-9 h-9 rounded-lg text-sm flex items-center justify-center transition-colors ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "border hover:bg-muted"
                }`}
              >
                {p}
              </Link>
            ))}
            {page < num_pages && (
              <Link
                href={`?page=${page + 1}`}
                className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
