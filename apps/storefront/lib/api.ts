/**
 * Storefront API helpers — App Router Server-side only.
 */

import { fetcher, type ApiResponse } from "@repo/api";

/**
 * Standard fetcher for the storefront.
 */
export async function storefrontFetch<T = any>(
    url: string,
    options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
        queryParams?: any;
    } = {}
): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, queryParams } = options;
    return fetcher<T>(url, method, body, headers, queryParams);
}

// ─── Catalog API ─────────────────────────────────────────────────────────────

export async function getStorefrontProducts(
    shopSlug: string,
    params?: any,
) {
    return storefrontFetch(`/api/v1/storefront/${shopSlug}/products/`, { 
        queryParams: params,
    });
}

export async function getStorefrontProduct(
    shopSlug: string,
    productSlug: string,
) {
    return storefrontFetch(`/api/v1/storefront/${shopSlug}/products/${productSlug}/`);
}

export async function getStorefrontShop(shopSlug: string) {
    return storefrontFetch(`/api/v1/storefront/${shopSlug}/config/`);
}

export async function getStorefrontPaymentInvoice(
    shopSlug: string,
    token: string,
) {
    return storefrontFetch(`/api/v1/storefront/${shopSlug}/pay/${token}/`);
}

export async function confirmStorefrontPaymentInvoiceCod(
    shopSlug: string,
    token: string,
) {
    return storefrontFetch(`/api/v1/storefront/${shopSlug}/pay/${token}/cod-confirm/`, {
        method: "POST",
    });
}
