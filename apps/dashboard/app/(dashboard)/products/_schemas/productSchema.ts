import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(500, "Product name must be 500 characters or less"),
  slug: z.string().optional(),
  category_id: z.string().uuid().optional().nullable(),
  description: z.string().default(""),
  status: z
    .enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"])
    .default("DRAFT"),
  publish_at: z.string().optional().nullable(),
  base_price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: "Price must be a valid positive number",
    }),
  compare_at_price: z.string().optional().nullable(),
  tax_rate: z
    .string()
    .default("0")
    .refine(
      (v) =>
        !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 1,
      { message: "Tax rate must be between 0 and 1 (e.g. 0.15 = 15%)" },
    ),
  sku: z.string().max(120).optional(),
  weight_grams: z.number().int().nonnegative().optional().nullable(),
  length_cm: z.string().optional().nullable(),
  width_cm: z.string().optional().nullable(),
  height_cm: z.string().optional().nullable(),
  is_digital: z.boolean().default(false),
  specifications: z.record(z.string(), z.unknown()).default({}),
  seo_title: z.string().max(120).default(""),
  seo_description: z.string().max(320).default(""),
  sort_order: z.number().int().nonnegative().default(0),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const variantSchema = z.object({
  attribute_name_1: z.string().max(50).default(""),
  attribute_value_1: z.string().max(100).default(""),
  attribute_name_2: z.string().max(50).default(""),
  attribute_value_2: z.string().max(100).default(""),
  sku: z.string().max(120).default(""),
  price_override: z.string().optional().nullable(),
  weight_override_grams: z.number().int().nonnegative().optional().nullable(),
  stock_quantity: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export type VariantFormValues = z.infer<typeof variantSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const trackingConfigSchema = z.object({
  fb_pixel_id: z.string().max(50).default(""),
  ga4_measurement_id: z
    .string()
    .max(50)
    .default("")
    .refine((v) => v === "" || v.startsWith("G-"), {
      message: "GA4 Measurement ID must start with G-",
    }),
  gtm_id: z
    .string()
    .max(50)
    .default("")
    .refine((v) => v === "" || v.startsWith("GTM-"), {
      message: "GTM ID must start with GTM-",
    }),
});

export type TrackingConfigFormValues = z.infer<typeof trackingConfigSchema>;
