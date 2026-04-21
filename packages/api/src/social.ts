/**
 * @repo/api — Social API client types
 */

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
