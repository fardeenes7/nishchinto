import { getActiveShopContext } from "@/lib/api";

export type DashboardShopContext = {
    shopId: string;
    shopName: string;
    baseCurrency: string;
    role: "OWNER" | "MANAGER" | "CASHIER";
    subscription: {
        tier: "FREE" | "BASIC" | "PRO" | "BUSINESS" | "CUSTOM";
        status: "ACTIVE" | "GRACE" | "SUSPENDED" | "COMPLIANCE_LOCK" | "CANCELLED";
        is_storefront_live: boolean;
        suspension_banner: string | null;
        limits: {
            max_products: number;
            max_staff: number;
            pos_system: boolean;
            developer_api: boolean;
            [key: string]: any;
        };
    };
};

export async function requireActiveShopContext(): Promise<DashboardShopContext> {
    const contextRes = await getActiveShopContext();
    if (!contextRes.success) {
        throw new Error(
            contextRes.error || "Unable to resolve active shop context.",
        );
    }

    return {
        shopId: contextRes.data.shop.id,
        shopName: contextRes.data.shop.name,
        baseCurrency: contextRes.data.shop.base_currency,
        role: contextRes.data.role,
        subscription: contextRes.data.subscription,
    };
}
