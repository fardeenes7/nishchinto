import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getCategories, getProductSocialActivity } from "@/lib/api";
import { requireActiveShopContext } from "@/lib/shop-context";
import { ProductForm } from "../../_components/ProductForm";
import { ProductSocialTimeline } from "../../_components/ProductSocialTimeline";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: EditProductPageProps): Promise<Metadata> {
    const activeShop = await requireActiveShopContext();
    const { id } = await params;
    const res = await getProduct(activeShop.shopId, id);
    if (!res.success) return { title: "Edit Product | Nishchinto Dashboard" };
    return {
        title: `Edit: ${res.data.name} | Nishchinto Dashboard`,
    };
}

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const activeShop = await requireActiveShopContext();
    const { id } = await params;
    const [productRes, categoriesRes] = await Promise.all([
        getProduct(activeShop.shopId, id),
        getCategories(activeShop.shopId),
    ]);

    if (!productRes.success) notFound();

    const categories = categoriesRes.success ? categoriesRes.data : [];
    const socialLogsRes = await getProductSocialActivity(activeShop.shopId, id);

    return (
        <div className="flex flex-col gap-6">
            <ProductForm
                shopId={activeShop.shopId}
                categories={categories}
                initialData={productRes.data}
                mode="edit"
            />
            <ProductSocialTimeline
                items={socialLogsRes.success ? socialLogsRes.data : []}
            />
        </div>
    );
}
