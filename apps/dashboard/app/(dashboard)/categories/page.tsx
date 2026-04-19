import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories } from "@/lib/api";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { CategoryTree } from "./_components/CategoryTree";
import { NewCategoryButton } from "./_components/NewCategoryButton";

export const metadata: Metadata = {
  title: "Categories | Nishchinto Dashboard",
  description: "Manage your product categories",
};

// TODO v0.4: Replace with real shop ID from auth context/cookie
const MOCK_SHOP_ID = process.env.MOCK_SHOP_ID ?? "";

async function CategoriesContent() {
  const result = await getCategories(MOCK_SHOP_ID);

  if (!result.success) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to load categories: {result.error}
      </div>
    );
  }

  const categories = result.data;

  return (
    <>
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
        </span>
      </div>
      <CategoryTree categories={categories} shopId={MOCK_SHOP_ID} />
    </>
  );
}

export default async function CategoriesPage() {
  // Pre-fetch for the NewCategoryButton's parent selector — we need this data
  // client-side too, so we read it server-side and pass it down as props.
  const result = await getCategories(MOCK_SHOP_ID);
  const categories = result.success ? result.data : [];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organise your product catalog with a parent → child category tree.
          </p>
        </div>
        <NewCategoryButton categories={categories} shopId={MOCK_SHOP_ID} />
      </div>

      {/* ── Tree ────────────────────────────────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        }
      >
        <CategoriesContent />
      </Suspense>
    </div>
  );
}
