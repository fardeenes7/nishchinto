import { apiFetch } from "./auth-fetcher";
import { type ApiResponse } from "./fetcher";

export interface Shop {
    id: string;
    name: string;
    subdomain: string;
    base_currency: string;
    created_at: string;
    updated_at: string;
}

export interface ActiveShopContext {
    shop: Shop;
    role: "OWNER" | "MANAGER" | "CASHIER";
}

export async function getShop(
    shopId: string,
    token?: string,
): Promise<ApiResponse<Shop>> {
    return apiFetch<Shop>(
        `/api/v1/shops/me/`,
        {
            headers: {
                "X-Tenant-ID": shopId,
            },
        },
        token,
    );
}

export async function updateShop(
    shopId: string,
    data: Partial<Pick<Shop, "name" | "base_currency">>,
    token?: string,
): Promise<ApiResponse<Shop>> {
    return apiFetch<Shop>(
        `/api/v1/shops/me/`,
        {
            method: "PATCH",
            headers: {
                "X-Tenant-ID": shopId,
            },
            body: JSON.stringify(data),
        },
        token,
    );
}

export async function getActiveShopContext(
    shopId?: string,
    token?: string,
): Promise<ApiResponse<ActiveShopContext>> {
    return apiFetch<ActiveShopContext>(
        `/api/v1/shops/active/`,
        {
            headers: shopId
                ? {
                      "X-Tenant-ID": shopId,
                  }
                : undefined,
        },
        token,
    );
}
