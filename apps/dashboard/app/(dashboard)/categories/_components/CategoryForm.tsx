"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@repo/ui/components/ui/sheet";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldContent
} from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import { Switch } from "@repo/ui/components/ui/switch";
import { Button } from "@repo/ui/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@repo/ui/components/ui/select";
import { createCategory, updateCategory } from "@/lib/api";
import { z } from "zod";
import type { Category } from "@repo/api";

// ── Schema ─────────────────────────────────────────────────────────────────

const categorySchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    parent_id: z.uuid().nullable().optional(),
    sort_order: z.number(),
    is_active: z.boolean()
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// ── Props ─────────────────────────────────────────────────────────────────

interface CategoryFormProps {
    /** If set, the form is in edit mode for this category. */
    category?: Category;
    /** All categories for the shop (used to populate the parent selector). */
    allCategories: Category[];
    shopId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export function CategoryForm({
    category,
    allCategories,
    shopId,
    open,
    onOpenChange
}: CategoryFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const isEdit = !!category;

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema as any),
        defaultValues: {
            name: category?.name ?? "",
            parent_id: category?.parent ?? null,
            sort_order: category?.sort_order ?? 0,
            is_active: category?.is_active ?? true
        }
    });

    async function onSubmit(values: CategoryFormValues) {
        const res = isEdit
            ? await updateCategory(shopId, category!.id, {
                  name: values.name,
                  sort_order: values.sort_order,
                  is_active: values.is_active
              })
            : await createCategory(shopId, {
                  name: values.name,
                  parent_id: values.parent_id ?? null,
                  sort_order: values.sort_order
              });

        if (res.success) {
            toast.success(
                isEdit
                    ? `Category "${values.name}" updated.`
                    : `Category "${values.name}" created.`
            );
            form.reset();
            onOpenChange(false);
            startTransition(() => router.refresh());
        } else {
            toast.error(res.error ?? "Something went wrong.");
        }
    }

    // Exclude the current category from the parent selector to prevent cycles
    const parentOptions = allCategories.filter((c) => c.id !== category?.id);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {isEdit ? "Edit Category" : "New Category"}
                    </SheetTitle>
                    <SheetDescription>
                        {isEdit
                            ? "Update the category details below."
                            : "Create a new category for your catalog."}
                    </SheetDescription>
                </SheetHeader>

                <form
                    id="category-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6 mt-6"
                >
                    <FieldGroup>
                        {/* Name */}
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="e.g. Clothing"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Parent (only available on create) */}
                        {!isEdit && (
                            <Controller
                                name="parent_id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor={field.name}>
                                                Parent Category
                                            </FieldLabel>
                                            <FieldDescription>
                                                Creates a subcategory under the
                                                selected parent.
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </FieldContent>
                                        <Select
                                            name={field.name}
                                            onValueChange={(val) =>
                                                field.onChange(
                                                    val === "none" ? null : val
                                                )
                                            }
                                            value={field.value ?? "none"}
                                        >
                                            <SelectTrigger
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <SelectValue placeholder="Select parent" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    No parent (top-level)
                                                </SelectItem>
                                                {parentOptions.map((cat) => (
                                                    <SelectItem
                                                        key={cat.id}
                                                        value={cat.id}
                                                    >
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />
                        )}

                        {/* Sort Order */}
                        <Controller
                            name="sort_order"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Sort Order
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="number"
                                        min={0}
                                        aria-invalid={fieldState.invalid}
                                        onChange={(e) =>
                                            field.onChange(
                                                isNaN(e.target.valueAsNumber)
                                                    ? 0
                                                    : e.target.valueAsNumber
                                            )
                                        }
                                    />
                                    <FieldDescription>
                                        Lower numbers appear first in your
                                        storefront.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Is Active */}
                        <Controller
                            name="is_active"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    orientation="horizontal"
                                    data-invalid={fieldState.invalid}
                                    className="rounded-xl border p-4"
                                >
                                    <FieldContent>
                                        <FieldLabel
                                            htmlFor={field.name}
                                            className="text-base font-medium"
                                        >
                                            Active Status
                                        </FieldLabel>
                                        <FieldDescription>
                                            Inactive categories are hidden from
                                            the storefront.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </FieldContent>
                                    <Switch
                                        id={field.name}
                                        name={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <div className="flex gap-2 justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            id="category-form-submit-btn"
                            type="submit"
                            disabled={isPending || form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? "Saving…"
                                : isEdit
                                  ? "Save Changes"
                                  : "Create Category"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
