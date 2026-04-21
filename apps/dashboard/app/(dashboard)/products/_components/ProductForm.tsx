"use client";

import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { IconDeviceFloppy, IconLoader2 } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Switch } from "@repo/ui/components/ui/switch";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { Field, FieldLabel, FieldDescription } from "@repo/ui/components/ui/field";
import { Badge } from "@repo/ui/components/ui/badge";
import { productSchema, type ProductFormValues } from "../_schemas/productSchema";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUploader } from "./ImageUploader";
import { VariantMatrix } from "./VariantMatrix";
import { createProduct, updateProduct, createVariant } from "@/lib/api";
import type { Category, ProductDetail } from "@repo/api";

interface ProductFormProps {
  shopId: string;
  categories: Category[];
  initialData?: ProductDetail;
  mode: "create" | "edit";
}

export function ProductForm({
  shopId,
  categories,
  initialData,
  mode,
}: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [variantRows, setVariantRows] = useState<unknown[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    watch,
  } = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: standardSchemaResolver(productSchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          category_id: initialData.category?.id ?? null,
          description: initialData.description,
          status: initialData.status as ProductFormValues["status"],
          base_price: initialData.base_price,
          compare_at_price: initialData.compare_at_price ?? null,
          tax_rate: initialData.tax_rate,
          sku: initialData.sku,
          weight_grams: initialData.weight_grams ?? null,
          is_digital: initialData.is_digital,
          seo_title: initialData.seo_title,
          seo_description: initialData.seo_description,
          sort_order: initialData.sort_order,
        }
      : {
          name: "",
          description: "",
          status: "DRAFT",
          base_price: "",
          tax_rate: "0",
          is_digital: false,
          specifications: {},
          seo_title: "",
          seo_description: "",
          sort_order: 0,
        },
  });

  const watchedName = watch("name");

    const onSubmit = async (data: unknown) => {
    const formData = data as ProductFormValues;
    setIsSubmitting(true);
    try {
      let result;
      if (mode === "create") {
        result = await createProduct(shopId, { ...formData, media_ids: mediaIds });
      } else {
        result = await updateProduct(shopId, initialData!.id, {
          ...formData,
          media_ids: mediaIds,
        });
      }

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const product = result.data;

      // Create variants if we have them (create mode only)
      if (mode === "create" && variantRows.length > 0) {
        const variantErrors: string[] = [];
        for (const variant of variantRows as Record<string, unknown>[]) {
          const vRes = await createVariant(shopId, product.id, variant);
          if (!vRes.success) variantErrors.push(vRes.error);
        }
        if (variantErrors.length > 0) {
          toast.error(`Product saved, but ${variantErrors.length} variant(s) failed.`);
        }
      }

      toast.success(
        mode === "create"
          ? `"${product.name}" created successfully!`
          : `"${product.name}" updated.`,
      );
      router.push("/products");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* ── Header bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {mode === "create" ? "New Product" : (watchedName || "Edit Product")}
          </h1>
          {initialData && (
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">SKU: {initialData.sku}</Badge>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            id="save-product-btn"
            variant={isDirty ? "default" : "secondary"}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <IconLoader2 className="size-4 animate-spin" data-icon="inline-start" />
            ) : (
              <IconDeviceFloppy data-icon="inline-start" />
            )}
            {mode === "create" ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left column: main fields */}
        <div className="col-span-2 flex flex-col gap-6">
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* ── Basic Tab ─────────────────────────────────────── */}
            <TabsContent value="basic" className="flex flex-col gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Field data-invalid={!!errors.name}>
                    <FieldLabel htmlFor="product-name">Name *</FieldLabel>
                    <Input
                      id="product-name"
                      placeholder="e.g. Classic Cotton T-Shirt"
                      aria-invalid={!!errors.name}
                      {...register("name")}
                    />
                    {errors.name && (
                      <FieldDescription className="text-destructive">
                        {errors.name.message}
                      </FieldDescription>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="product-description">Description</FieldLabel>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Field>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Upload up to 10 images. First image becomes the thumbnail.
                    All images are automatically converted to WebP.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    shopId={shopId}
                    value={mediaIds}
                    onChange={setMediaIds}
                    maxImages={10}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Variants Tab ──────────────────────────────────── */}
            <TabsContent value="variants" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>
                    Define attributes (e.g. Size, Color) and generate variant
                    combinations. Max 2 attributes, 25 variants.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mode === "create" ? (
                    <VariantMatrix onVariantsGenerated={setVariantRows} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      To manage variants for an existing product, use the
                      Variants section below the form.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── SEO Tab ───────────────────────────────────────── */}
            <TabsContent value="seo" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Metadata</CardTitle>
                  <CardDescription>
                    Improve your product&apos;s discoverability in search engines.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="seo-title">
                      SEO Title
                      <span className="ml-auto text-xs text-muted-foreground">
                        {watch("seo_title")?.length ?? 0} / 120
                      </span>
                    </FieldLabel>
                    <Input
                      id="seo-title"
                      placeholder="Leave blank to use product name"
                      {...register("seo_title")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="seo-description">
                      Meta Description
                      <span className="ml-auto text-xs text-muted-foreground">
                        {watch("seo_description")?.length ?? 0} / 320
                      </span>
                    </FieldLabel>
                    <Textarea
                      id="seo-description"
                      placeholder="Brief summary for search results..."
                      rows={3}
                      {...register("seo_description")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="product-slug">URL Slug</FieldLabel>
                    <Input
                      id="product-slug"
                      placeholder="auto-generated-from-name"
                      {...register("slug")}
                    />
                    <FieldDescription>
                      Leave blank to auto-generate from the product name.
                    </FieldDescription>
                  </Field>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column: pricing, status */}
        <div className="flex flex-col gap-4">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="product-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field data-invalid={!!errors.base_price}>
                <FieldLabel htmlFor="base-price">Price (BDT) *</FieldLabel>
                <Input
                  id="base-price"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  aria-invalid={!!errors.base_price}
                  {...register("base_price")}
                />
                {errors.base_price && (
                  <FieldDescription className="text-destructive">
                    {errors.base_price.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="compare-at-price">
                  Compare-at Price
                </FieldLabel>
                <Input
                  id="compare-at-price"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Original price (shown crossed-out)"
                  {...register("compare_at_price")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tax-rate">Tax Rate</FieldLabel>
                <Input
                  id="tax-rate"
                  type="number"
                  min={0}
                  max={1}
                  step="0.01"
                  placeholder="0.00 (e.g. 0.15 = 15%)"
                  {...register("tax_rate")}
                />
              </Field>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="product-category">Category</FieldLabel>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? "__none__"}
                      onValueChange={(v) =>
                        field.onChange(v === "__none__" ? null : v)
                      }
                    >
                      <SelectTrigger id="product-category">
                        <SelectValue placeholder="No category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">No category</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
                <Input
                  id="product-sku"
                  placeholder="Auto-generated if blank"
                  {...register("sku")}
                />
                <FieldDescription>
                  Leave blank to auto-generate from shop prefix.
                </FieldDescription>
              </Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="is-digital">Digital Product</FieldLabel>
                <Controller
                  name="is_digital"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="is-digital"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Field>
                <FieldLabel htmlFor="weight-grams">Weight (grams)</FieldLabel>
                <Input
                  id="weight-grams"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("weight_grams", { valueAsNumber: true })}
                />
              </Field>
              <div className="grid grid-cols-3 gap-2">
                <Field>
                  <FieldLabel htmlFor="length-cm">Length</FieldLabel>
                  <Input
                    id="length-cm"
                    type="number"
                    min={0}
                    step="0.1"
                    placeholder="cm"
                    {...register("length_cm")}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="width-cm">Width</FieldLabel>
                  <Input
                    id="width-cm"
                    type="number"
                    min={0}
                    step="0.1"
                    placeholder="cm"
                    {...register("width_cm")}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="height-cm">Height</FieldLabel>
                  <Input
                    id="height-cm"
                    type="number"
                    min={0}
                    step="0.1"
                    placeholder="cm"
                    {...register("height_cm")}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
