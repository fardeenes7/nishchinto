/**
 * @repo/api — Catalog API client
 *
 * Framework-agnostic typed wrappers for all v0.3 catalog endpoints.
 *
 * ── Auth pattern ──────────────────────────────────────────────────────────────
 * Every mutating / authenticated function accepts an optional `token` as its
 * LAST parameter. This keeps the package free of Next.js dependencies — the
 * caller reads the token from wherever it lives and passes it down.
 *
 *   // App Router Server Component (dashboard)
 *   import { serverFetch } from '@/lib/api';        // reads cookies internally
 *   const token = ...;                              // or pass explicitly
 *   const res = await getProducts(shopId, {}, token);
 *
 *   // Storefront (no auth needed)
 *   const res = await getStorefrontProducts(shopSlug);
 *
 * Storefront functions use `publicFetch` and never need a token.
 */

import { apiFetch } from "./auth-fetcher";
import { publicFetch, type ApiResponse } from "./fetcher";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MediaBrief {
  id: string;
  cdn_url: string;
  width: number | null;
  height: number | null;
  processing_status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  sort_order: number;
  is_active: boolean;
  children_count: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  attribute_name_1: string;
  attribute_value_1: string;
  attribute_name_2: string;
  attribute_value_2: string;
  price_override: string | null;
  weight_override_grams: number | null;
  stock_quantity: number;
  is_active: boolean;
  effective_price: string;
  image: MediaBrief | null;
  created_at: string;
}

export interface ProductMedia {
  id: string;
  media: MediaBrief;
  sort_order: number;
  is_thumbnail: boolean;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "OUT_OF_STOCK" | "ARCHIVED";
  base_price: string;
  compare_at_price: string | null;
  tax_rate: string;
  total_stock: number;
  thumbnail: string | null;
  category_name: string | null;
  is_digital: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProductDetail extends ProductListItem {
  description: string;
  publish_at: string | null;
  weight_grams: number | null;
  length_cm: string | null;
  width_cm: string | null;
  height_cm: string | null;
  specifications: Record<string, unknown>;
  seo_title: string;
  seo_description: string;
  category: Category | null;
  variants: ProductVariant[];
  product_media: ProductMedia[];
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  num_pages: number;
  results: T[];
}

export interface ShopTrackingConfig {
  id: string;
  fb_pixel_id: string;
  ga4_measurement_id: string;
  gtm_id: string;
  updated_at: string;
}

export interface StorefrontShop {
  id: string;
  name: string;
  subdomain: string;
  base_currency: string;
}

export interface PresignedUploadResponse {
  upload_url: string;
  s3_key: string;
  cdn_url: string;
}

export interface MediaRecord {
  id: string;
  original_filename: string;
  cdn_url: string;
  width: number | null;
  height: number | null;
  file_size: number | null;
  mime_type: string;
  processing_status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  created_at: string;
}

// ─── Media API ────────────────────────────────────────────────────────────────

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  shopId: string,
  token?: string,
): Promise<ApiResponse<PresignedUploadResponse>> {
  return apiFetch<PresignedUploadResponse>(
    `/api/v1/media/upload-url/?filename=${encodeURIComponent(filename)}&content_type=${encodeURIComponent(contentType)}`,
    { method: "GET", headers: { "X-Tenant-ID": shopId } },
    token,
  );
}

export async function confirmUpload(
  s3Key: string,
  originalFilename: string,
  shopId: string,
  token?: string,
): Promise<ApiResponse<MediaRecord>> {
  return apiFetch<MediaRecord>("/api/v1/media/confirm/", {
    method: "POST",
    body: { s3_key: s3Key, original_filename: originalFilename },
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

export async function uploadFileToS3(
  presignedUrl: string,
  file: File,
): Promise<Response> {
  // Direct S3 PUT — no auth header, the presigned URL carries the credentials.
  return fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
}

export async function deleteMedia(
  mediaId: string,
  shopId: string,
  token?: string,
): Promise<ApiResponse<null>> {
  return apiFetch(`/api/v1/media/${mediaId}/`, {
    method: "DELETE",
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

// ─── Category API ─────────────────────────────────────────────────────────────

export async function getCategories(
  shopId: string,
  token?: string,
): Promise<ApiResponse<Category[]>> {
  return apiFetch<Category[]>("/api/v1/catalog/categories/", {
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

export async function createCategory(
  shopId: string,
  data: { name: string; parent_id?: string | null; sort_order?: number },
  token?: string,
): Promise<ApiResponse<Category>> {
  return apiFetch<Category>("/api/v1/catalog/categories/", {
    method: "POST",
    body: data,
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

export async function updateCategory(
  shopId: string,
  categoryId: string,
  data: Partial<{ name: string; sort_order: number; is_active: boolean }>,
  token?: string,
): Promise<ApiResponse<Category>> {
  return apiFetch<Category>(`/api/v1/catalog/categories/${categoryId}/`, {
    method: "PATCH",
    body: data,
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

export async function deleteCategory(
  shopId: string,
  categoryId: string,
  token?: string,
): Promise<ApiResponse<null>> {
  return apiFetch(`/api/v1/catalog/categories/${categoryId}/`, {
    method: "DELETE",
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

// ─── Product API (Dashboard) ──────────────────────────────────────────────────

export async function getProducts(
  shopId: string,
  params?: {
    status?: string;
    category_id?: string;
    search?: string;
    page?: number;
    page_size?: number;
  },
  token?: string,
): Promise<ApiResponse<PaginatedResponse<ProductListItem>>> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.category_id) query.set("category_id", params.category_id);
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.page_size) query.set("page_size", String(params.page_size));

  const qs = query.toString();
  return apiFetch<PaginatedResponse<ProductListItem>>(
    `/api/v1/catalog/products/${qs ? `?${qs}` : ""}`,
    { headers: { "X-Tenant-ID": shopId } },
    token,
  );
}

export async function getProduct(
  shopId: string,
  productId: string,
  token?: string,
): Promise<ApiResponse<ProductDetail>> {
  return apiFetch<ProductDetail>(`/api/v1/catalog/products/${productId}/`, {
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

export async function createProduct(
  shopId: string,
  data: Record<string, unknown>,
  token?: string,
): Promise<ApiResponse<ProductDetail>> {
  return apiFetch<ProductDetail>("/api/v1/catalog/products/", {
    method: "POST",
    body: data,
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

export async function updateProduct(
  shopId: string,
  productId: string,
  data: Record<string, unknown>,
  token?: string,
): Promise<ApiResponse<ProductDetail>> {
  return apiFetch<ProductDetail>(`/api/v1/catalog/products/${productId}/`, {
    method: "PATCH",
    body: data,
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

export async function publishProduct(
  shopId: string,
  productId: string,
  token?: string,
): Promise<ApiResponse<ProductDetail>> {
  return apiFetch<ProductDetail>(
    `/api/v1/catalog/products/${productId}/publish/`,
    { method: "POST", headers: { "X-Tenant-ID": shopId } },
    token,
  );
}

export async function archiveProduct(
  shopId: string,
  productId: string,
  token?: string,
): Promise<ApiResponse<ProductDetail>> {
  return apiFetch<ProductDetail>(
    `/api/v1/catalog/products/${productId}/archive/`,
    { method: "POST", headers: { "X-Tenant-ID": shopId } },
    token,
  );
}

export async function deleteProduct(
  shopId: string,
  productId: string,
  token?: string,
): Promise<ApiResponse<null>> {
  return apiFetch(`/api/v1/catalog/products/${productId}/`, {
    method: "DELETE",
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

// ─── Variant API ──────────────────────────────────────────────────────────────

export async function getVariants(
  shopId: string,
  productId: string,
  token?: string,
): Promise<ApiResponse<ProductVariant[]>> {
  return apiFetch<ProductVariant[]>(
    `/api/v1/catalog/products/${productId}/variants/`,
    { headers: { "X-Tenant-ID": shopId } },
    token,
  );
}

export async function createVariant(
  shopId: string,
  productId: string,
  data: Record<string, unknown>,
  token?: string,
): Promise<ApiResponse<ProductVariant>> {
  return apiFetch<ProductVariant>(
    `/api/v1/catalog/products/${productId}/variants/`,
    { method: "POST", body: data, headers: { "X-Tenant-ID": shopId } },
    token,
  );
}

export async function adjustVariantStock(
  shopId: string,
  productId: string,
  variantId: string,
  data: { delta: number; reason: string; reference_id?: string },
  token?: string,
): Promise<ApiResponse<ProductVariant>> {
  return apiFetch<ProductVariant>(
    `/api/v1/catalog/products/${productId}/variants/${variantId}/adjust-stock/`,
    { method: "POST", body: data, headers: { "X-Tenant-ID": shopId } },
    token,
  );
}

// ─── Tracking Config API ──────────────────────────────────────────────────────

export async function getTrackingConfig(
  shopId: string,
  token?: string,
): Promise<ApiResponse<ShopTrackingConfig>> {
  return apiFetch<ShopTrackingConfig>("/api/v1/catalog/tracking-config/", {
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

export async function updateTrackingConfig(
  shopId: string,
  data: Partial<{
    fb_pixel_id: string;
    ga4_measurement_id: string;
    gtm_id: string;
  }>,
  token?: string,
): Promise<ApiResponse<ShopTrackingConfig>> {
  return apiFetch<ShopTrackingConfig>("/api/v1/catalog/tracking-config/", {
    method: "PATCH",
    body: data,
    headers: { "X-Tenant-ID": shopId },
  }, token);
}

// ─── Storefront API (Public — no auth) ───────────────────────────────────────

export async function getStorefrontProducts(
  shopSlug: string,
  params?: { category?: string; page?: number; page_size?: number },
): Promise<ApiResponse<PaginatedResponse<ProductListItem>>> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.page) query.set("page", String(params.page));
  if (params?.page_size) query.set("page_size", String(params.page_size));

  const qs = query.toString();
  return publicFetch<PaginatedResponse<ProductListItem>>(
    `/api/v1/storefront/${shopSlug}/products/${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
}

export async function getStorefrontProduct(
  shopSlug: string,
  productSlug: string,
): Promise<ApiResponse<ProductDetail>> {
  return publicFetch<ProductDetail>(
    `/api/v1/storefront/${shopSlug}/products/${productSlug}/`,
    { next: { revalidate: 60 } },
  );
}

export async function getStorefrontTrackingConfig(
  shopSlug: string,
): Promise<ApiResponse<ShopTrackingConfig>> {
  return publicFetch<ShopTrackingConfig>(
    `/api/v1/storefront/${shopSlug}/tracking/`,
    { next: { revalidate: 300 } },
  );
}

export async function getStorefrontShop(
  shopSlug: string,
): Promise<ApiResponse<StorefrontShop>> {
  return publicFetch<StorefrontShop>(
    `/api/v1/storefront/${shopSlug}/config/`,
    { next: { revalidate: 3600 } }, // Cache shop config for 1 hour
  );
}
