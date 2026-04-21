"use client";

/**
 * ClaimForm — Client Component
 *
 * Handles user interaction for the shop claim flow.
 * Token is passed from the RSC parent (read from searchParams server-side)
 * so we never need `useSearchParams()` here.
 */

import { useActionState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { claimShopAction } from "@/lib/api";
import { type ApiResponse } from "@repo/api";
import Link from "next/link";

const claimSchema = z.object({
    subdomain: z
        .string()
        .min(3, "Subdomain must be at least 3 characters")
        .max(63, "Subdomain is too long")
        .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
});

type ClaimFormValues = z.infer<typeof claimSchema>;

const initialState: ApiResponse = { success: false, status: 0, data: null, error: "" };

export function ClaimForm({ token }: { token: string }) {
    const [state, formAction, isPending] = useActionState(
        claimShopAction,
        initialState,
    );

    const form = useForm<ClaimFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: standardSchemaResolver(claimSchema) as any,
        defaultValues: { subdomain: "", password: "", passwordConfirm: "" },
    });

    if (state.success) {
        return (
            <div className="text-center space-y-4">
                <div className="text-5xl">🎉</div>
                <h2 className="text-xl font-bold text-green-600">Shop Activated!</h2>
                <p className="text-muted-foreground">
                    Your store is live. Log in to access your dashboard.
                </p>
                <Link
                    href="/login"
                    className="inline-block mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="text-center text-destructive space-y-2">
                <p className="font-medium">Invalid invite link.</p>
                <p className="text-sm text-muted-foreground">
                    Please use the link from your invitation email.
                </p>
            </div>
        );
    }

    return (
        <form
            action={formAction}
            onSubmit={form.handleSubmit((_, e) => {
                // Client validation passes → let native form fire the Server Action
                (e?.target as HTMLFormElement).requestSubmit();
            })}
            className="space-y-5"
        >
            {/* Hidden — token is passed from server, not typed by user */}
            <input type="hidden" name="token" value={token} />

            {!state.success && state.error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    {state.error}
                </div>
            )}

            <Controller
                name="subdomain"
                control={form.control}
                render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                        <label htmlFor="claim-subdomain" className="text-sm font-medium">
                            Your Store Address
                        </label>
                        <div className="flex items-center gap-0">
                            <input
                                {...field}
                                id="claim-subdomain"
                                name="subdomain"
                                aria-invalid={fieldState.invalid}
                                placeholder="my-shop"
                                className="flex-1 px-3 py-2 border rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <span className="px-3 py-2 border border-l-0 bg-muted text-muted-foreground rounded-r-md text-sm whitespace-nowrap">
                                .nishchinto.com.bd
                            </span>
                        </div>
                        {fieldState.error && (
                            <p className="text-xs text-destructive">{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />

            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                        <label htmlFor="claim-password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            {...field}
                            type="password"
                            id="claim-password"
                            name="password"
                            aria-invalid={fieldState.invalid}
                            placeholder="Minimum 8 characters"
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {fieldState.error && (
                            <p className="text-xs text-destructive">{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />

            <Controller
                name="passwordConfirm"
                control={form.control}
                render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                        <label htmlFor="claim-password-confirm" className="text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            {...field}
                            type="password"
                            id="claim-password-confirm"
                            name="passwordConfirm"
                            aria-invalid={fieldState.invalid}
                            placeholder="Re-enter your password"
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {fieldState.error && (
                            <p className="text-xs text-destructive">{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
                {isPending ? "Activating..." : "Activate My Store"}
            </button>
        </form>
    );
}
