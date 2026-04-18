import type { Metadata } from "next";
import { getCategories } from "@/lib/api";
import { ProductForm } from "../_components/ProductForm";

export const metadata: Metadata = {
  title: "New Product | Nishchinto Dashboard",
};

const MOCK_SHOP_ID = process.env.MOCK_SHOP_ID ?? "";

export default async function NewProductPage() {
  const categoriesRes = await getCategories(MOCK_SHOP_ID);
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <ProductForm
      shopId={MOCK_SHOP_ID}
      categories={categories}
      mode="create"
    />
  );
}
