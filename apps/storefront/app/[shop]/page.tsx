import { getStorefrontTheme, getStorefrontShop } from "@/lib/api";
import { BlockRenderer } from "../components/BlockRenderer";
import { notFound } from "next/navigation";

interface ShopHomePageProps {
  params: Promise<{ shop: string }>;
}

export default async function ShopHomePage({ params }: ShopHomePageProps) {
  const { shop } = await params;

  const [themeRes, shopRes] = await Promise.all([
    getStorefrontTheme(shop),
    getStorefrontShop(shop)
  ]);

  if (!shopRes.success) {
    notFound();
  }

  const themeData = themeRes.success ? themeRes.data : null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <BlockRenderer theme={themeData} shopInfo={shopRes.data} />
    </div>
  );
}
