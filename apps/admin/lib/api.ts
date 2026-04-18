/**
 * Admin API helpers — Pages Router compatible.
 *
 * No `next/headers` — reads cookies from the raw request object instead,
 * which is available in getServerSideProps, API Routes, and middleware.
 *
 * Usage in getServerSideProps:
 *   import { makeServerFetch } from '@/lib/api';
 *
 *   export async function getServerSideProps(ctx) {
 *     const apiFetch = makeServerFetch(ctx.req.cookies);
 *     const res = await apiFetch('/api/v1/marketing/waitlist/');
 *     ...
 *   }
 *
 * Usage in an API Route:
 *   import { makeServerFetch } from '@/lib/api';
 *
 *   export default async function handler(req, res) {
 *     const apiFetch = makeServerFetch(req.cookies);
 *     ...
 *   }
 */

import { apiFetch, type FetcherInit, type ApiResponse } from "@repo/api";

/**
 * Returns a pre-authenticated fetch function bound to the token
 * found in the provided cookie map.
 *
 * @param cookieMap - `req.cookies` from getServerSideProps / API Route context
 */
export function makeServerFetch(cookieMap: Partial<Record<string, string>>) {
  const token = cookieMap["access_token"];
  return function serverFetch<T = unknown>(
    endpoint: string,
    init: FetcherInit = {},
  ): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, init, token);
  };
}
