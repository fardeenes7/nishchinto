import { apiFetch } from "./auth-fetcher";
import { type ApiResponse } from "./fetcher";

export interface SocialConnection {
    id: string;
    provider: "META";
    page_id: string;
    page_name: string;
    status: "ACTIVE" | "EXPIRED" | "DISCONNECTED";
    token_expires_at: string | null;
    last_refreshed_at: string | null;
    last_error: string;
    created_at: string;
    updated_at: string;
}

export interface ProductSocialPostLog {
    id: string;
    product: string;
    connection: string;
    connection_page_name: string;
    idempotency_key: string;
    status: "QUEUED" | "SUCCESS" | "FAILED";
    retry_count: number;
    external_post_id: string;
    error_message: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SocialOAuthStartResponse {
    shop_id: string;
    provider: "META";
    state: string;
    redirect_uri: string;
    auth_url: string;
}

export interface SocialOAuthPageOption {
    id: string;
    name: string;
}

export interface SocialOAuthCallbackResponse {
    oauth_state?: string;
    pages?: SocialOAuthPageOption[];
    connection?: SocialConnection;
}

export async function startSocialOAuth(
    shopId: string,
    token?: string,
): Promise<ApiResponse<SocialOAuthStartResponse>> {
    return apiFetch<SocialOAuthStartResponse>(
        "/api/v1/marketing/social/connect/start/",
        {
            method: "POST",
            headers: { "X-Tenant-ID": shopId },
        },
        token,
    );
}

export async function handleSocialOAuthCallback(
    shopId: string,
    data:
        | { code: string; state: string; selected_page_id?: string }
        | { oauth_state: string; selected_page_id: string },
    token?: string,
): Promise<ApiResponse<SocialOAuthCallbackResponse>> {
    return apiFetch<SocialOAuthCallbackResponse>(
        "/api/v1/marketing/social/connect/callback/",
        {
            method: "POST",
            body: data,
            headers: { "X-Tenant-ID": shopId },
        },
        token,
    );
}

export async function getSocialConnections(
    shopId: string,
    token?: string,
): Promise<ApiResponse<SocialConnection[]>> {
    return apiFetch<SocialConnection[]>(
        "/api/v1/marketing/social/connections/",
        {
            headers: { "X-Tenant-ID": shopId },
        },
        token,
    );
}

export async function createSocialConnection(
    shopId: string,
    data: {
        provider: "META";
        page_id: string;
        page_name: string;
        access_token: string;
        expires_in?: number;
    },
    token?: string,
): Promise<ApiResponse<SocialConnection>> {
    return apiFetch<SocialConnection>(
        "/api/v1/marketing/social/connections/",
        {
            method: "POST",
            body: data,
            headers: { "X-Tenant-ID": shopId },
        },
        token,
    );
}

export async function disconnectSocialConnection(
    shopId: string,
    connectionId: string,
    token?: string,
): Promise<ApiResponse<null>> {
    return apiFetch<null>(
        `/api/v1/marketing/social/connections/${connectionId}/disconnect/`,
        {
            method: "POST",
            headers: { "X-Tenant-ID": shopId },
        },
        token,
    );
}

export async function publishProductToSocial(
    shopId: string,
    data: {
        product_id: string;
        connection_id: string;
        idempotency_key?: string;
    },
    token?: string,
): Promise<ApiResponse<ProductSocialPostLog>> {
    return apiFetch<ProductSocialPostLog>(
        "/api/v1/marketing/social/publish/",
        {
            method: "POST",
            body: data,
            headers: { "X-Tenant-ID": shopId },
        },
        token,
    );
}

export async function publishProductsToSocial(
    shopId: string,
    data: {
        product_ids: string[];
        connection_id: string;
    },
    token?: string,
): Promise<ApiResponse<ProductSocialPostLog[]>> {
    return apiFetch<ProductSocialPostLog[]>(
        "/api/v1/marketing/social/publish/bulk/",
        {
            method: "POST",
            body: data,
            headers: { "X-Tenant-ID": shopId },
        },
        token,
    );
}

export async function getProductSocialActivity(
    shopId: string,
    productId: string,
    token?: string,
): Promise<ApiResponse<ProductSocialPostLog[]>> {
    return apiFetch<ProductSocialPostLog[]>(
        `/api/v1/marketing/social/products/${productId}/activity/`,
        {
            headers: { "X-Tenant-ID": shopId },
        },
        token,
    );
}
