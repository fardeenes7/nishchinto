import type { Metadata } from "next";
import { getCategories } from "@/lib/api";
import { requireActiveShopContext } from "@/lib/shop-context";
import { ProductForm } from "../_components/ProductForm";

export const metadata: Metadata = {
    title: "New Product | Mohajon Dashboard"
};

export default async function NewProductPage() {
    const activeShop = await requireActiveShopContext();
    const categoriesRes = await getCategories(activeShop.shopId);
    const categories = categoriesRes.success ? categoriesRes.data : [];

    return (
        <ProductForm
            shopId={activeShop.shopId}
            categories={categories}
            mode="create"
        />
    );
}
