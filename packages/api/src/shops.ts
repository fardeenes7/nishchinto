/**
 * @repo/api — Shops API client types
 */

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
