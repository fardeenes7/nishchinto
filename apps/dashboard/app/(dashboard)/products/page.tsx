import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getProducts, getSocialConnections } from "@/lib/api";
import { requireActiveShopContext } from "@/lib/shop-context";
import { Button } from "@repo/ui/components/ui/button";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { IconPlus } from "@tabler/icons-react";
import { ProductTable } from "./_components/ProductTable";
import { ProductFilters } from "./_components/ProductFilters";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@repo/ui/components/ui/pagination";

export const metadata: Metadata = {
    title: "Products | Nishchinto Dashboard",
    description: "Manage your product catalog",
};

interface ProductsPageProps {
    searchParams: Promise<{
        status?: string;
        search?: string;
        page?: string;
    }>;
}

async function ProductsContent({
    shopId,
    currency,
    status,
    search,
    page,
}: {
    shopId: string;
    currency: string;
    status?: string;
    search?: string;
    page: number;
}) {
    const result = await getProducts(shopId, {
        status: status && status !== "all" ? status : undefined,
        search,
        page,
        page_size: 20,
    });
    const socialConnectionsRes = await getSocialConnections(shopId);
    const defaultSocialConnectionId = socialConnectionsRes.success
        ? socialConnectionsRes.data.find(
              (connection) => connection.status === "ACTIVE",
          )?.id
        : undefined;

    if (!result.success) {
        return (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                Failed to load products: {result.error}
            </div>
        );
    }

    const { results, count, num_pages } = result.data;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    {count} product{count !== 1 ? "s" : ""} total
                </span>
            </div>
            <ProductTable
                products={results}
                shopId={shopId}
                currency={currency}
                defaultSocialConnectionId={defaultSocialConnectionId}
            />
            {num_pages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href={`?page=${page - 1}`}
                                />
                            </PaginationItem>
                        )}
                        {Array.from({ length: num_pages }, (_, i) => i + 1).map(
                            (p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        href={`?page=${p}`}
                                        isActive={p === page}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ),
                        )}
                        {page < num_pages && (
                            <PaginationItem>
                                <PaginationNext href={`?page=${page + 1}`} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page ?? "1");
    const activeShop = await requireActiveShopContext();

    return (
        <div className="flex flex-col gap-6">
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Products</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Manage your product catalog and inventory
                    </p>
                </div>
                <Button id="add-product-btn" asChild>
                    <Link href="/products/new">
                        <IconPlus data-icon="inline-start" />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* ── Filters ──────────────────────────────────────────────── */}
            <Suspense fallback={<Skeleton className="h-10 w-80" />}>
                <ProductFilters />
            </Suspense>

            {/* ── Table ────────────────────────────────────────────────── */}
            <Suspense
                fallback={
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full" />
                        ))}
                    </div>
                }
            >
                <ProductsContent
                    shopId={activeShop.shopId}
                    currency={activeShop.baseCurrency}
                    status={params.status}
                    search={params.search}
                    page={page}
                />
            </Suspense>
        </div>
    );
}
