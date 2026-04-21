/**
 * Admin API helpers — App Router Server-side only.
 */

import { cookies } from "next/headers";
import { fetcher, type ApiResponse } from "@repo/api";

/**
 * App-specific authFetcher for the admin app.
 */
export async function authFetcher<T = any>(
    url: string,
    options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
        queryParams?: any;
    } = {}
): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, queryParams } = options;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value ?? cookieStore.get("nishchinto_jwt")?.value;

    const mergedHeaders = { ...headers };
    if (token) {
        mergedHeaders["Authorization"] = `Bearer ${token}`;
    }

    return fetcher<T>(url, method, body, mergedHeaders, queryParams);
}

// ─── Marketing / Waitlist API ────────────────────────────────────────────────

export async function getWaitlistEntries() {
    return authFetcher<any[]>("/api/v1/marketing/waitlist/admin/", {
        headers: { "Cache-Control": "no-store" }
    });
}

export async function approveWaitlistEntry(entryId: number) {
    return authFetcher<any>(`/api/v1/marketing/waitlist/admin/${entryId}/approve/`, {
        method: "POST"
    });
}
