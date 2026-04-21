"use server";

/**
 * Storefront API helpers — App Router Server-side only.
 */

import { 
    fetcher, 
    type ApiResponse,
    type ProductListItem,
    type ProductDetail,
    type PaginatedResponse,
    type StorefrontShop,
    type StorefrontPaymentInvoice,
    type StorefrontPaymentInvoiceConfirmResult,
    type ShopTrackingConfig
} from "@repo/api";


import { redirect } from "next/navigation";


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
    return storefrontFetch<PaginatedResponse<ProductListItem>>(`/api/v1/storefront/${shopSlug}/products/`, { 
        queryParams: params,
    });
}


export async function getStorefrontProduct(
    shopSlug: string,
    productSlug: string,
) {
    return storefrontFetch<ProductDetail>(`/api/v1/storefront/${shopSlug}/products/${productSlug}/`);
}


export async function getStorefrontShop(shopSlug: string) {
    return storefrontFetch<StorefrontShop>(`/api/v1/storefront/${shopSlug}/config/`);
}

export async function getStorefrontTrackingConfig(shopSlug: string) {
    return storefrontFetch<ShopTrackingConfig>(`/api/v1/storefront/${shopSlug}/tracking/`);
}



export async function getStorefrontPaymentInvoice(
    shopSlug: string,
    token: string,
) {
    return storefrontFetch<StorefrontPaymentInvoice>(`/api/v1/storefront/${shopSlug}/pay/${token}/`);
}


export async function confirmStorefrontPaymentInvoiceCod(
    shopSlug: string,
    token: string,
) {
    return storefrontFetch<StorefrontPaymentInvoiceConfirmResult>(`/api/v1/storefront/${shopSlug}/pay/${token}/cod-confirm/`, {
        method: "POST",
    });
}


/**
 * Server Action: Confirm COD payment and redirect.
 */
export async function confirmStorefrontCodAction(
    shop: string,
    token: string,
) {
    const confirmRes = await confirmStorefrontPaymentInvoiceCod(shop, token);
    
    if (!confirmRes.success) {
        // Redirect back to the pay page to show the "link unavailable" state if 410
        // or just general retry. 
        redirect(`/${shop}/pay/${token}`);
    }

    redirect(`/${shop}/pay/${token}/confirmed?orderId=${confirmRes.data.order_id}`);
}

