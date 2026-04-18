import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getCategories } from "@/lib/api";
import { ProductForm } from "../../_components/ProductForm";

const MOCK_SHOP_ID = process.env.MOCK_SHOP_ID ?? "";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getProduct(MOCK_SHOP_ID, id);
  if (!res.success) return { title: "Edit Product | Nishchinto Dashboard" };
  return {
    title: `Edit: ${res.data.name} | Nishchinto Dashboard`,
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [productRes, categoriesRes] = await Promise.all([
    getProduct(MOCK_SHOP_ID, id),
    getCategories(MOCK_SHOP_ID),
  ]);

  if (!productRes.success) notFound();

  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <ProductForm
      shopId={MOCK_SHOP_ID}
      categories={categories}
      initialData={productRes.data}
      mode="edit"
    />
  );
}
