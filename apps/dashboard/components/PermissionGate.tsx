"use client";

import React from "react";
import { DashboardShopContext } from "@/lib/shop-context";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
import { IconLock } from "@tabler/icons-react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

interface PermissionGateProps {
    context: DashboardShopContext;
    feature?: string;
    limit?: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
    showInaccessible?: boolean;
}

/**
 * PermissionGate conditionally renders content based on the shop's subscription tier.
 * Supports checking for boolean features or numeric limits.
 */
export function PermissionGate({
    context,
    feature,
    limit,
    fallback,
    children,
    showInaccessible = false,
}: PermissionGateProps) {
    const { subscription } = context;
    const { limits } = subscription;

    let hasAccess = true;

    if (feature) {
        hasAccess = !!limits[feature];
    }

    // Example: If checking for 'max_products', this gate usually doesn't wrap the list,
    // but the 'Create' button. We might need a more complex check for limits.
    // For now, limit check is a simple boolean check if the limit exists/is > 0.
    if (limit) {
        hasAccess = (limits[limit] ?? 0) > 0;
    }

    if (hasAccess) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    if (showInaccessible) {
        return (
            <Alert variant="destructive" className="bg-muted/50 border-dashed">
                <IconLock className="size-4" />
                <AlertTitle>Feature Locked</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                    <span>
                        Your current <strong>{subscription.tier}</strong> plan does not include this feature.
                    </span>
                    <Button variant="outline" size="sm" asChild className="ml-4">
                        <Link href="/settings/billing">Upgrade Plan</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}
