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

import { redirect } from "next/navigation";

export async function requireActiveShopContext(): Promise<DashboardShopContext> {
    const contextRes = await getActiveShopContext();
    
    if (!contextRes.success) {
        // If it's a 401 Unauthorized or 403 Forbidden, redirect to login
        if (contextRes.status === 401 || contextRes.status === 403) {
            redirect("/login");
        }

        // If the backend is down (status 0) or other error, we throw 
        // which will be caught by Next.js error boundaries.
        // But we provide a more user-friendly message.
        const errorMessage = contextRes.status === 0 
            ? "Our servers are currently unreachable. Please check your internet connection or try again later."
            : (contextRes.error || "Unable to resolve active shop context.");

        throw new Error(errorMessage);
    }

    return {
        shopId: contextRes.data.shop.id,
        shopName: contextRes.data.shop.name,
        baseCurrency: contextRes.data.shop.base_currency,
        role: contextRes.data.role,
        subscription: contextRes.data.subscription,
    };
}
