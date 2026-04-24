/**
 * @repo/api — Public surface
 */

export {
    fetcher,
    publicFetch,
    type ApiResponse,
    type ApiSuccess,
    type ApiError,
} from "./fetcher";

export type * from "./schema";
export * from "./catalog";
export * from "./orders";
export * from "./shops";
export * from "./social";
