/**
 * Web App API helpers — App Router Server-side only.
 */

import { fetcher, type ApiResponse } from "@repo/api";

export async function publicFetch<T = any>(
    url: string,
    options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
        queryParams?: any;
    } = {}
): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers, queryParams } = options;
    return fetcher<T>(url, method, body, headers, queryParams);
}
