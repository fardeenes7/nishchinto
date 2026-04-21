/**
 * @repo/api — Generic Fetcher
 *
 * A thin, type-safe wrapper around the native `fetch` API.
 * Reads `API_BASE_URL` from the environment (server-only).
 */

import { headersToObject, resolveBody, getBaseUrl, normaliseEndpoint, extractDjangoError } from "./utils";

// ─── Response Types ──────────────────────────────────────────────────────────

export type ApiSuccess<T> = {
    success: true;
    status: number;
    data: T;
};

export type ApiError = {
    success: false;
    status: number; // 0 = network failure
    data: null;
    error: string;
};

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Generic Fetcher ─────────────────────────────────────────────────────────

/**
 * The core fetcher wrapper.
 * Framework-agnostic and carries no opinionated defaults.
 *
 * @param url         - Relative path (e.g. /api/v1/shops/)
 * @param method      - HTTP verb (GET, POST, etc.)
 * @param body        - Plain object, FormData, or native BodyInit
 * @param headers     - Custom headers object
 * @param queryParams - Plain object of key-values to be appended to the URL
 */
export async function fetcher<T = unknown>(
    url: string,
    method: string = 'GET',
    body?: any,
    headers?: Record<string, string>,
    queryParams?: Record<string, string | number | boolean | undefined>,
): Promise<ApiResponse<T>> {
    const { resolvedBody, inferredContentType } = resolveBody(body);

    // 1. Build Query String
    let queryString = "";
    if (queryParams) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });
        const stringified = params.toString();
        if (stringified) {
            queryString = `?${stringified}`;
        }
    }

    // 2. Build Headers
    const mergedHeaders: Record<string, string> = {};
    if (inferredContentType) {
        mergedHeaders['Content-Type'] = inferredContentType;
    }
    if (headers) {
        Object.assign(mergedHeaders, headers);
    }

    const fullUrl = `${getBaseUrl()}${normaliseEndpoint(url)}${queryString}`;

    let response: Response;
    try {
        response = await fetch(fullUrl, {
            method,
            body: resolvedBody,
            headers: mergedHeaders,
        });
    } catch (err) {
        return {
            success: false,
            status: 0,
            data: null,
            error: err instanceof Error ? err.message : 'Network error — could not reach API.',
        };
    }

    // 3. Parse JSON Response
    let parsedData: unknown = null;
    const responseContentType = response.headers.get('Content-Type') ?? '';
    if (response.status !== 204 && responseContentType.includes('application/json')) {
        try {
            parsedData = await response.json();
        } catch {
            // Ignore parse errors for non-JSON or malformed responses
        }
    }

    if (!response.ok) {
        return {
            success: false,
            status: response.status,
            data: null,
            error: extractDjangoError(
                parsedData,
                `HTTP ${response.status}: ${response.statusText}`,
            ),
        };
    }

    return {
        success: true,
        status: response.status,
        data: parsedData as T,
    };
}
