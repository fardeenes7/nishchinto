/**
 * Dashboard API helpers — App Router Server-side only.
 *
 * This file is the ONLY place in the dashboard app that imports `next/headers`.
 *
 * ── Usage in Server Components ───────────────────────────────────────────────
 *   import { getProducts, getCategories, ... } from '@/lib/api';
 *
 * These are thin wrappers that read the JWT from the HTTP-only cookie and
 * forward it to the corresponding @repo/api function. Drop-in replacements —
 * same signatures as @repo/api, minus the trailing `token` parameter.
 *
 * ── Usage in Client Components (mutations) ───────────────────────────────────
 * Client components call Server Actions. The Server Action runs on the server,
 * reads cookies, and calls these helpers. Never import next/headers in a
 * Client Component.
 */

import { cookies } from "next/headers";
import {
  apiFetch,
  getCategories as _getCategories,
  getProducts as _getProducts,
  getProduct as _getProduct,
  createProduct as _createProduct,
  updateProduct as _updateProduct,
  publishProduct as _publishProduct,
  archiveProduct as _archiveProduct,
  deleteProduct as _deleteProduct,
  getVariants as _getVariants,
  createVariant as _createVariant,
  adjustVariantStock as _adjustVariantStock,
  getTrackingConfig as _getTrackingConfig,
  updateTrackingConfig as _updateTrackingConfig,
  getPresignedUploadUrl as _getPresignedUploadUrl,
  confirmUpload as _confirmUpload,
  deleteMedia as _deleteMedia,
  type FetcherInit,
  type ApiResponse,
} from "@repo/api";

/** Reads the access_token cookie. Returns undefined if not authenticated. */
async function getToken(): Promise<string | undefined> {
  return (await cookies()).get("access_token")?.value;
}

// ── Generic server fetch (for one-off calls not covered below) ──────────────

export async function serverFetch<T = unknown>(
  endpoint: string,
  init: FetcherInit = {},
): Promise<ApiResponse<T>> {
  const token = await getToken();
  return apiFetch<T>(endpoint, init, token);
}

// ── Catalog wrappers ─────────────────────────────────────────────────────────

export async function getCategories(shopId: string) {
  return _getCategories(shopId, await getToken());
}

export async function getProducts(
  shopId: string,
  params?: Parameters<typeof _getProducts>[1],
) {
  return _getProducts(shopId, params, await getToken());
}

export async function getProduct(shopId: string, productId: string) {
  return _getProduct(shopId, productId, await getToken());
}

export async function createProduct(
  shopId: string,
  data: Record<string, unknown>,
) {
  return _createProduct(shopId, data, await getToken());
}

export async function updateProduct(
  shopId: string,
  productId: string,
  data: Record<string, unknown>,
) {
  return _updateProduct(shopId, productId, data, await getToken());
}

export async function publishProduct(shopId: string, productId: string) {
  return _publishProduct(shopId, productId, await getToken());
}

export async function archiveProduct(shopId: string, productId: string) {
  return _archiveProduct(shopId, productId, await getToken());
}

export async function deleteProduct(shopId: string, productId: string) {
  return _deleteProduct(shopId, productId, await getToken());
}

export async function getVariants(shopId: string, productId: string) {
  return _getVariants(shopId, productId, await getToken());
}

export async function createVariant(
  shopId: string,
  productId: string,
  data: Record<string, unknown>,
) {
  return _createVariant(shopId, productId, data, await getToken());
}

export async function adjustVariantStock(
  shopId: string,
  productId: string,
  variantId: string,
  data: Parameters<typeof _adjustVariantStock>[3],
) {
  return _adjustVariantStock(shopId, productId, variantId, data, await getToken());
}

export async function getTrackingConfig(shopId: string) {
  return _getTrackingConfig(shopId, await getToken());
}

export async function updateTrackingConfig(
  shopId: string,
  data: Parameters<typeof _updateTrackingConfig>[1],
) {
  return _updateTrackingConfig(shopId, data, await getToken());
}

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  shopId: string,
) {
  return _getPresignedUploadUrl(filename, contentType, shopId, await getToken());
}

export async function confirmUpload(
  s3Key: string,
  originalFilename: string,
  shopId: string,
) {
  return _confirmUpload(s3Key, originalFilename, shopId, await getToken());
}

export async function deleteMedia(mediaId: string, shopId: string) {
  return _deleteMedia(mediaId, shopId, await getToken());
}
