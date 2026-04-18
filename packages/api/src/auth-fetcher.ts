/**
 * @repo/api — Authenticated Fetcher (Framework-Agnostic)
 *
 * A pure HTTP client function with ZERO framework dependencies.
 * It accepts an optional `token` string and attaches it as
 * `Authorization: Bearer <token>` — the caller is responsible
 * for reading the token from wherever it lives (Next.js cookies,
 * express req, a test fixture, etc.).
 *
 * ── How to use in Next.js App Router (dashboard / storefront) ──
 * Create a thin wrapper in your app's `lib/api.ts`:
 *
 *   import { cookies } from 'next/headers';
 *   import { apiFetch } from '@repo/api';
 *
 *   export async function serverFetch<T>(endpoint: string, init?: FetcherInit) {
 *     const token = (await cookies()).get('access_token')?.value;
 *     return apiFetch<T>(endpoint, init, token);
 *   }
 *
 * ── How to use in Next.js Pages Router (admin) ──
 * Create a factory in your app's `lib/api.ts`:
 *
 *   import type { NextApiRequest } from 'next';
 *   import { apiFetch } from '@repo/api';
 *
 *   export function makeApiFetch(req: NextApiRequest) {
 *     const token = req.cookies['access_token'];
 *     return <T>(endpoint: string, init?: FetcherInit) =>
 *       apiFetch<T>(endpoint, init, token);
 *   }
 */

import { publicFetch, type FetcherInit, type ApiResponse } from "./fetcher";

/**
 * `apiFetch` — authenticated, framework-agnostic fetcher.
 *
 * @param endpoint - API path, e.g. `/api/v1/catalog/products/`
 * @param init     - Native fetch options (body, method, cache, headers, …)
 * @param token    - Optional Bearer token. If omitted the request is unauthenticated.
 *                   Any `Authorization` header already present in `init.headers` wins.
 */
export async function apiFetch<T = unknown>(
    endpoint: string,
    init: FetcherInit = {},
    token?: string,
): Promise<ApiResponse<T>> {
    // Normalise init.headers to a plain object so we can safely spread it.
    let customHeaders: Record<string, string> = {};
    if (init.headers) {
        if (init.headers instanceof Headers) {
            init.headers.forEach((value, key) => {
                customHeaders[key] = value;
            });
        } else if (Array.isArray(init.headers)) {
            customHeaders = Object.fromEntries(init.headers);
        } else {
            customHeaders = { ...(init.headers as Record<string, string>) };
        }
    }

    // Only inject the token if the caller hasn't already set Authorization.
    const authHeaders: Record<string, string> = {};
    if (
        token &&
        !customHeaders["Authorization"] &&
        !customHeaders["authorization"]
    ) {
        authHeaders["Authorization"] = `Bearer ${token}`;
    }

    return publicFetch<T>(endpoint, {
        ...init,
        headers: {
            ...authHeaders,
            ...customHeaders,
        },
    });
}
