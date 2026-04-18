/**
 * @repo/api — Authenticated Fetcher
 *
 * A thin wrapper around `publicFetch` that automatically reads the user's
 * JWT from the server-side cookie store and attaches it as an
 * `Authorization: Bearer <token>` header.
 *
 * ⚠️  This module imports `next/headers` (cookies). This means:
 *   - It CANNOT be used inside `use cache` segments or ISR pages that
 *     need to be shareable across users.
 *   - It CAN be used in non-cached Server Components, Server Actions,
 *     and Route Handlers.
 *
 * If a request must be cacheable, use `publicFetch` from `./fetcher` instead
 * and handle auth at a higher level (e.g., pass the token explicitly via init.headers).
 */

import { cookies } from 'next/headers';
import { publicFetch, type FetcherInit, type ApiResponse } from './fetcher';

/** Name of the HTTP-only cookie storing the JWT access token. */
const ACCESS_TOKEN_COOKIE = 'access_token';

/**
 * `apiFetch` — authenticated server-side fetcher.
 *
 * Reads the JWT from the `access_token` HTTP-only cookie and forwards it
 * as `Authorization: Bearer <token>`. If no cookie exists (unauthenticated),
 * the header is omitted and the request proceeds without auth — the Django
 * API will return a 401 which is surfaced in the `ApiError` return value.
 *
 * All options are forwarded to `publicFetch` (and therefore to native `fetch`)
 * with no defaults enforced. Callers control caching, revalidation, and
 * signal options explicitly.
 *
 * Custom `Authorization` headers passed in `init.headers` take precedence
 * over the cookie-derived token.
 *
 * @example
 * // In a non-cached Server Component
 * const res = await apiFetch<WaitlistEntry[]>('/api/v1/marketing/waitlist/admin/', {
 *     cache: 'no-store',
 * });
 * if (!res.success) throw new Error(res.error);
 * const entries = res.data;
 *
 * @example
 * // In a Server Action (mutation)
 * const res = await apiFetch('/api/v1/shops/claim/', {
 *     method: 'POST',
 *     body: { token, subdomain, password },
 *     cache: 'no-store',
 * });
 * if (!res.success) return { status: 'error', message: res.error };
 * return { status: 'success' };
 */
export async function apiFetch<T = unknown>(
    endpoint: string,
    init: FetcherInit = {},
): Promise<ApiResponse<T>> {
    // next/headers cookies() is async in Next.js 16
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    // Normalise init.headers to a plain object so we can safely spread it.
    // Use forEach on Headers instances — avoids [Symbol.iterator] which requires
    // DOM.Iterable to be compiled in, not guaranteed in standalone package builds.
    let customHeaders: Record<string, string> = {};
    if (init.headers) {
        if (init.headers instanceof Headers) {
            init.headers.forEach((value, key) => { customHeaders[key] = value; });
        } else if (Array.isArray(init.headers)) {
            customHeaders = Object.fromEntries(init.headers);
        } else {
            customHeaders = { ...(init.headers as Record<string, string>) };
        }
    }

    const authHeaders: Record<string, string> = {};
    if (token && !customHeaders['Authorization'] && !customHeaders['authorization']) {
        authHeaders['Authorization'] = `Bearer ${token}`;
    }

    return publicFetch<T>(endpoint, {
        ...init,
        headers: {
            ...authHeaders,
            ...customHeaders,
        },
    });
}
