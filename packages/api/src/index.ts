/**
 * @repo/api — Public surface
 *
 * Exports:
 *  - `publicFetch`  — cache-safe, no auth, safe inside `use cache` segments
 *  - `apiFetch`     — reads JWT from HTTP-only cookie; NOT safe in cached segments
 *  - `ApiResponse`, `ApiSuccess`, `ApiError`, `FetcherInit` — shared types
 *  - Generated OpenAPI schema types from Django (`schema.d.ts`)
 */

export {
    publicFetch,
    type ApiResponse,
    type ApiSuccess,
    type ApiError,
    type FetcherInit,
    type FetcherBody,
} from "./fetcher";
export { apiFetch } from "./auth-fetcher";
export type * from "./schema";
export * from "./catalog";
export * from "./shops";
export * from "./social";
