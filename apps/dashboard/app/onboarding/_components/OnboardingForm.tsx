"use client";

import { useActionState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createShopAction } from "@/lib/api";
import { type ApiResponse } from "@repo/api";
import { useRouter } from "next/navigation";
import {
    Field,
    FieldLabel,
    FieldError,
    FieldGroup,
    FieldDescription
} from "@repo/ui/components/ui/field";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupText
} from "@repo/ui/components/ui/input-group";
import { Button } from "@repo/ui/components/ui/button";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";
import { Input } from "@repo/ui/components/ui/input";
import { toast } from "sonner";

const onboardingSchema = z.object({
    name: z
        .string()
        .min(3, "Shop name must be at least 3 characters")
        .max(255, "Shop name is too long"),
    subdomain: z
        .string()
        .min(3, "Subdomain must be at least 3 characters")
        .max(63, "Subdomain is too long")
        .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens")
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const slugify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export function OnboardingForm() {
    const router = useRouter();
    const isManualSlug = useRef(false);

    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: { name: "", subdomain: "" }
    });

    const { control, watch, setValue, handleSubmit } = form;
    const shopName = watch("name");

    // Auto-generate slug from name unless manually edited
    useEffect(() => {
        if (!isManualSlug.current && shopName) {
            setValue("subdomain", slugify(shopName), { shouldValidate: true });
        }
    }, [shopName, setValue]);

    async function onSubmit(values: OnboardingFormValues) {
        try {
            const response = await createShopAction(values);
            if (response.success) {
                router.push("/");
                router.refresh();
            } else {
                throw new Error(response.error || "Error creating shop");
            }
        } catch (error: any) {
            toast.error(error?.message || "Error creating shop");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="shop-name">
                                Shop Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="shop-name"
                                placeholder="e.g. My Awesome Boutique"
                                aria-invalid={fieldState.invalid}
                            />
                            <FieldDescription>
                                This is the public name of your store.
                            </FieldDescription>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Field>
                    <FieldLabel htmlFor="shop-subdomain">
                        Store Address
                    </FieldLabel>
                    <Controller
                        name="subdomain"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id="shop-subdomain"
                                        placeholder="my-shop"
                                        aria-invalid={fieldState.invalid}
                                        onChange={(e) => {
                                            isManualSlug.current = true;
                                            field.onChange(e);
                                        }}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>
                                            .nishchinto.com.bd
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription>
                                    Your customers will visit this URL to buy
                                    products.
                                </FieldDescription>
                                <FieldError errors={[fieldState.error]} />
                            </>
                        )}
                    />
                </Field>

                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                >
                    {form.formState.isSubmitting && (
                        <Spinner data-icon="inline-start" />
                    )}
                    {form.formState.isSubmitting
                        ? "Creating Shop..."
                        : "Launch My Shop"}
                </Button>
            </FieldGroup>
        </form>
    );
}
