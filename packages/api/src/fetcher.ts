/**
 * @repo/api — Public Fetcher
 *
 * A thin, type-safe wrapper around the native `fetch` API.
 * Reads `API_BASE_URL` from the environment (server-only; no NEXT_PUBLIC_ prefix).
 *
 * This module has NO dependency on `next/headers` and is therefore safe to call
 * from ANY server context — including cached RSCs and `use cache` segments.
 * Use `apiFetch` (auth-fetcher.ts) when you need to forward the user's JWT.
 *
 * Design goals:
 *  - Behaves exactly like native `fetch` — no opinionated defaults (cache, revalidate, etc.)
 *  - Auto-serializes plain objects/arrays as JSON and sets Content-Type automatically
 *  - Merges custom headers on top of inferred ones (custom headers always win)
 *  - Returns a discriminated union so callers never need to check `res.ok`
 */

// ─── Response Type ───────────────────────────────────────────────────────────

export type ApiSuccess<T> = {
    success: true;
    status: number;
    data: T;
};

export type ApiError = {
    success: false;
    status: number; // 0 = network failure (no HTTP response)
    data: null;
    error: string;
};

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Init Type ───────────────────────────────────────────────────────────────

/**
 * Extends the native `RequestInit` with an extended `body` type that
 * additionally accepts plain objects and arrays (auto-serialized to JSON).
 * All other native fetch options (cache, next, signal, credentials, etc.)
 * are forwarded as-is with no defaults applied.
 */
export type FetcherBody =
    | RequestInit['body']         // string, Blob, FormData, URLSearchParams, ArrayBuffer, ReadableStream, null
    | Record<string, unknown>     // plain object → auto JSON.stringify
    | unknown[];                  // array → auto JSON.stringify

export interface FetcherInit extends Omit<RequestInit, 'body'> {
    body?: FetcherBody;
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Determines the correct BodyInit and infers a Content-Type header if needed.
 * If the caller passes a plain object or array, it is JSON-serialized.
 * FormData and URLSearchParams are passed through without a Content-Type
 * so the runtime can set the correct boundary/encoding automatically.
 */
function resolveBody(body: FetcherBody | undefined): {
    resolvedBody: BodyInit | null | undefined;
    inferredContentType: string | undefined;
} {
    if (body === undefined || body === null) {
        return { resolvedBody: undefined, inferredContentType: undefined };
    }

    // Native body types — pass through unchanged
    if (
        typeof body === 'string' ||
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof ReadableStream ||
        ArrayBuffer.isView(body)
    ) {
        return { resolvedBody: body, inferredContentType: undefined };
    }

    // Plain object or array — serialize as JSON
    return {
        resolvedBody: JSON.stringify(body),
        inferredContentType: 'application/json',
    };
}

/**
 * Returns `API_BASE_URL` with any trailing slash stripped.
 * Throws at call time (not module load time) so the error points to the
 * actual invocation site rather than a mysterious startup crash.
 */
function getBaseUrl(): string {
    const url = process.env.API_BASE_URL;
    if (!url) {
        throw new Error(
            '[fetcher] API_BASE_URL is not set. ' +
            'Add API_BASE_URL=http://... to your .env.local. ' +
            'Do NOT prefix with NEXT_PUBLIC_ — this variable must remain server-only.'
        );
    }
    return url.replace(/\/+$/, '');
}

/**
 * Normalises an endpoint string to always start with `/`.
 * e.g. `api/v1/shops/` → `/api/v1/shops/`
 */
function normaliseEndpoint(endpoint: string): string {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

/**
 * Converts a `Headers` instance to a plain object.
 * Uses `.forEach()` instead of `[Symbol.iterator]` because `.forEach()` is
 * typed in all DOM lib versions, while the iterable protocol (`DOM.Iterable`)
 * requires the augmentation to be applied at compile time — which isn't
 * guaranteed in standalone (non-Next.js) package compilation.
 */
function headersToObject(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

/**
 * Extracts a human-readable error message from a parsed Django DRF error body.
 * Django typically returns `{ detail: "..." }` or `{ field: ["..."] }`.
 */
function extractDjangoError(data: unknown, fallback: string): string {
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        if (typeof obj['detail'] === 'string') return obj['detail'];
        if (typeof obj['message'] === 'string') return obj['message'];
        // DRF field errors: { email: ["This field is required."] }
        const firstField = Object.values(obj)[0];
        if (Array.isArray(firstField) && typeof firstField[0] === 'string') {
            return firstField[0];
        }
    }
    return fallback;
}

// ─── Public Fetcher ──────────────────────────────────────────────────────────

/**
 * `publicFetch` — unauthenticated server-side fetcher.
 *
 * Safe to use in:
 *   - Any async Server Component (including `use cache` segments)
 *   - Server Actions
 *   - Route Handlers
 *
 * NOT suitable for:
 *   - Client Components (this module is server-only via API_BASE_URL)
 *   - Requests that require a user JWT (use `apiFetch` from auth-fetcher.ts)
 *
 * @example
 * // In a cached RSC (subscription plans, public pricing, etc.)
 * const res = await publicFetch<Plan[]>('/api/v1/billing/plans/', {
 *     next: { revalidate: 3600 }, // cache for 1 hour
 * });
 * if (!res.success) throw new Error(res.error);
 * const plans = res.data;
 *
 * @example
 * // POST with a plain object body (auto-serialized to JSON)
 * const res = await publicFetch('/api/v1/marketing/waitlist/', {
 *     method: 'POST',
 *     body: { email, phone_number, survey_data },
 *     cache: 'no-store',
 * });
 */
export async function publicFetch<T = unknown>(
    endpoint: string,
    init: FetcherInit = {},
): Promise<ApiResponse<T>> {
    const { body, headers: customHeaders, ...restInit } = init;
    const { resolvedBody, inferredContentType } = resolveBody(body);

    // Build headers: inferred first, custom on top (custom always wins)
    const mergedHeaders: Record<string, string> = {};
    if (inferredContentType) {
        mergedHeaders['Content-Type'] = inferredContentType;
    }
    if (customHeaders) {
        // customHeaders can be HeadersInit: Headers instance, string[][], or plain object.
        const normalised =
            customHeaders instanceof Headers
                ? headersToObject(customHeaders)              // forEach — always typed
                : Array.isArray(customHeaders)
                ? Object.fromEntries(customHeaders)           // string[][] — safe
                : (customHeaders as Record<string, string>);  // plain object — safe
        Object.assign(mergedHeaders, normalised);
    }

    const url = `${getBaseUrl()}${normaliseEndpoint(endpoint)}`;

    let response: Response;
    try {
        response = await fetch(url, {
            ...restInit,
            body: resolvedBody,
            headers: mergedHeaders,
        });
    } catch (err) {
        // Network-level failure (DNS, ECONNREFUSED, timeout, etc.)
        return {
            success: false,
            status: 0,
            data: null,
            error: err instanceof Error ? err.message : 'Network error — could not reach API.',
        };
    }

    // Parse response body (JSON only; ignore 204 No Content)
    let parsedData: unknown = null;
    const responseContentType = response.headers.get('Content-Type') ?? '';
    if (response.status !== 204 && responseContentType.includes('application/json')) {
        try {
            parsedData = await response.json();
        } catch {
            // Non-parseable JSON — leave as null
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
