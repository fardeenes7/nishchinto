"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    configurePaymentGateway,
    getPaymentGateways,
    getPaymentMethods,
    updatePaymentMethod
} from "@/lib/api";
import { Switch } from "@repo/ui/components/ui/switch";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@repo/ui/components/ui/dialog";
import { toast } from "sonner";

type PaymentMethod = {
    id: string;
    method: string;
    method_display: string;
    is_enabled: boolean;
    fee_payer: "MERCHANT" | "CUSTOMER";
};

type PaymentGatewayConfig = {
    id: string;
    gateway: string;
    gateway_display: string;
    label: string | null;
    is_active: boolean;
    is_test_mode: boolean;
};

type GatewayField = {
    key: string;
    label: string;
    placeholder: string;
    type?: string;
};

type MethodCatalogItem = {
    method: string;
    label: string;
    description: string;
    gateway: string | null;
    logo: {
        initials: string;
        tintClass: string;
        ringClass: string;
    };
    fields: GatewayField[];
};

const METHOD_CATALOG: MethodCatalogItem[] = [
    {
        method: "COD",
        label: "Cash on Delivery",
        description: "Accept cash at delivery",
        gateway: null,
        logo: {
            initials: "COD",
            tintClass: "text-amber-700",
            ringClass: "bg-amber-100"
        },
        fields: []
    },
    {
        method: "BKASH",
        label: "bKash",
        description: "Connect bKash checkout",
        gateway: "BKASH",
        logo: {
            initials: "bK",
            tintClass: "text-rose-600",
            ringClass: "bg-rose-100"
        },
        fields: [
            {
                key: "app_key",
                label: "App key",
                placeholder: "bkash_app_key"
            },
            {
                key: "app_secret",
                label: "App secret",
                placeholder: "bkash_app_secret",
                type: "password"
            },
            {
                key: "username",
                label: "Username",
                placeholder: "bkash_username"
            },
            {
                key: "password",
                label: "Password",
                placeholder: "bkash_password",
                type: "password"
            }
        ]
    },
    {
        method: "NAGAD",
        label: "Nagad",
        description: "Connect Nagad checkout",
        gateway: "NAGAD",
        logo: {
            initials: "NG",
            tintClass: "text-orange-600",
            ringClass: "bg-orange-100"
        },
        fields: [
            {
                key: "merchant_id",
                label: "Merchant ID",
                placeholder: "nagad_merchant_id"
            },
            {
                key: "public_key",
                label: "Public key",
                placeholder: "nagad_public_key"
            },
            {
                key: "private_key",
                label: "Private key",
                placeholder: "nagad_private_key",
                type: "password"
            }
        ]
    },
    {
        method: "SSLCOMMERZ",
        label: "SSLCommerz",
        description: "Cards and local wallets",
        gateway: "SSLCOMMERZ",
        logo: {
            initials: "SSL",
            tintClass: "text-sky-600",
            ringClass: "bg-sky-100"
        },
        fields: [
            {
                key: "store_id",
                label: "Store ID",
                placeholder: "sslcommerz_store_id"
            },
            {
                key: "store_password",
                label: "Store password",
                placeholder: "sslcommerz_store_password",
                type: "password"
            }
        ]
    },
    {
        method: "PORTPOS",
        label: "PortPOS",
        description: "Connect PortPOS",
        gateway: "PORTPOS",
        logo: {
            initials: "PP",
            tintClass: "text-violet-600",
            ringClass: "bg-violet-100"
        },
        fields: [
            {
                key: "api_key",
                label: "API key",
                placeholder: "portpos_api_key"
            },
            {
                key: "api_secret",
                label: "API secret",
                placeholder: "portpos_api_secret",
                type: "password"
            }
        ]
    },
    {
        method: "POLAR",
        label: "Polar",
        description: "Connect Polar payments",
        gateway: "POLAR",
        logo: {
            initials: "PL",
            tintClass: "text-emerald-600",
            ringClass: "bg-emerald-100"
        },
        fields: [
            {
                key: "api_key",
                label: "API key",
                placeholder: "polar_api_key"
            },
            {
                key: "api_secret",
                label: "API secret",
                placeholder: "polar_api_secret",
                type: "password"
            }
        ]
    },
    {
        method: "STRIPE",
        label: "Stripe",
        description: "Global cards and wallets",
        gateway: "STRIPE",
        logo: {
            initials: "ST",
            tintClass: "text-indigo-600",
            ringClass: "bg-indigo-100"
        },
        fields: [
            {
                key: "publishable_key",
                label: "Publishable key",
                placeholder: "stripe_publishable_key"
            },
            {
                key: "secret_key",
                label: "Secret key",
                placeholder: "stripe_secret_key",
                type: "password"
            }
        ]
    }
];

const createEmptyCredentials = (fields: GatewayField[]) =>
    fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.key] = "";
        return acc;
    }, {});

const buildFormState = (
    methodKey: string,
    fields: GatewayField[],
    gatewayConfig?: PaymentGatewayConfig
) => ({
    label: gatewayConfig?.label ?? "",
    is_test_mode: gatewayConfig?.is_test_mode ?? false,
    credentials: createEmptyCredentials(fields),
    methodKey
});

const getFormState = (
    previousState: Record<
        string,
        {
            label: string;
            is_test_mode: boolean;
            credentials: Record<string, string>;
            methodKey: string;
        }
    >,
    catalogItem: MethodCatalogItem,
    gatewayConfig?: PaymentGatewayConfig
) =>
    previousState[catalogItem.method] ??
    buildFormState(catalogItem.method, catalogItem.fields, gatewayConfig);

export function PaymentMethodList({ shopId }: { shopId: string }) {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMethod, setActiveMethod] = useState<string | null>(null);
    const [formState, setFormState] = useState<
        Record<
            string,
            {
                label: string;
                is_test_mode: boolean;
                credentials: Record<string, string>;
                methodKey: string;
            }
        >
    >({});
    const [savingGateway, setSavingGateway] = useState<string | null>(null);

    const refreshData = useCallback(async () => {
        const [methodRes, gatewayRes] = await Promise.all([
            getPaymentMethods(shopId),
            getPaymentGateways(shopId)
        ]);

        if (methodRes.success) {
            setMethods(methodRes.data);
        }
        if (gatewayRes.success) {
            setGateways(gatewayRes.data);
        }
        setLoading(false);
    }, [shopId]);

    const methodLookup = useMemo(
        () => new Map(methods.map((method) => [method.method, method])),
        [methods]
    );

    const gatewayLookup = useMemo(
        () => new Map(gateways.map((gateway) => [gateway.gateway, gateway])),
        [gateways]
    );

    const connectedAndEnabledCount = useMemo(() => {
        let count = 0;
        for (const catalogItem of METHOD_CATALOG) {
            const method = methodLookup.get(catalogItem.method);
            const isMethodEnabled = Boolean(method?.is_enabled);
            if (!isMethodEnabled) continue;

            const isGatewayConnected = catalogItem.gateway
                ? Boolean(gatewayLookup.get(catalogItem.gateway)?.is_active)
                : true;

            if (isGatewayConnected) {
                count++;
            }
        }
        return count;
    }, [methodLookup, gatewayLookup]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleToggle = async (methodId: string, isEnabled: boolean) => {
        const res = await updatePaymentMethod(shopId, methodId, {
            is_enabled: isEnabled
        });
        if (res.success) {
            setMethods((prev) =>
                prev.map((m) =>
                    m.id === methodId ? { ...m, is_enabled: isEnabled } : m
                )
            );
            toast.success("Payment method updated");
        } else {
            toast.error(res.error ?? "Failed to update payment method");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {METHOD_CATALOG.map((catalogItem) => {
                const method = methodLookup.get(catalogItem.method);
                const gatewayConfig = catalogItem.gateway
                    ? gatewayLookup.get(catalogItem.gateway)
                    : null;
                const isGatewayConnected = Boolean(gatewayConfig?.is_active);
                const isMethodEnabled = Boolean(method?.is_enabled);
                const isToggleAvailable =
                    Boolean(method?.id) &&
                    (catalogItem.gateway ? isGatewayConnected : true);
                const currentFormState = formState[catalogItem.method];

                return (
                    <Card
                        key={catalogItem.method}
                        className="flex h-full flex-col"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-3xl ${catalogItem.logo.ringClass}`}
                                >
                                    <span
                                        className={`text-xs font-semibold uppercase ${catalogItem.logo.tintClass}`}
                                    >
                                        {catalogItem.logo.initials}
                                    </span>
                                </div>
                                <div>
                                    <CardTitle className="text-base">
                                        {catalogItem.label}
                                    </CardTitle>
                                    <CardDescription>
                                        {catalogItem.description}
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {catalogItem.gateway ? (
                                    isGatewayConnected ? (
                                        <Badge
                                            variant="outline"
                                            className="border-emerald-200 text-emerald-600"
                                        >
                                            Connected
                                        </Badge>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setActiveMethod(
                                                    catalogItem.method
                                                );
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    [catalogItem.method]:
                                                        prev[
                                                            catalogItem.method
                                                        ] ??
                                                        buildFormState(
                                                            catalogItem.method,
                                                            catalogItem.fields,
                                                            gatewayConfig ??
                                                                undefined
                                                        )
                                                }));
                                            }}
                                        >
                                            Connect
                                        </Button>
                                    )
                                ) : (
                                    <Badge variant="outline">Always on</Badge>
                                )}
                                {method?.id && isToggleAvailable && (
                                    <Switch
                                        id={`switch-${catalogItem.method}`}
                                        checked={isMethodEnabled}
                                        disabled={
                                            isMethodEnabled &&
                                            connectedAndEnabledCount <= 1
                                        }
                                        onCheckedChange={(checked) =>
                                            handleToggle(method.id, checked)
                                        }
                                    />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-end justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                {catalogItem.gateway &&
                                    gatewayConfig?.label && (
                                        <Badge variant="outline">
                                            {gatewayConfig?.label}
                                        </Badge>
                                    )}
                                {(!catalogItem.gateway ||
                                    isGatewayConnected) && (
                                    <Badge variant="outline">
                                        {method?.fee_payer === "CUSTOMER"
                                            ? "Customer pays fee"
                                            : "Merchant absorbs fee"}
                                    </Badge>
                                )}
                                {(!catalogItem.gateway ||
                                    isGatewayConnected) && (
                                    <Badge
                                        variant="outline"
                                        className={
                                            isMethodEnabled
                                                ? "border-emerald-200 text-emerald-600"
                                                : "text-muted-foreground"
                                        }
                                    >
                                        {isMethodEnabled
                                            ? "Enabled"
                                            : "Disabled"}
                                    </Badge>
                                )}
                            </div>
                            {catalogItem.gateway && isGatewayConnected && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setActiveMethod(catalogItem.method);
                                        setFormState((prev) => ({
                                            ...prev,
                                            [catalogItem.method]:
                                                prev[catalogItem.method] ??
                                                buildFormState(
                                                    catalogItem.method,
                                                    catalogItem.fields,
                                                    gatewayConfig ?? undefined
                                                )
                                        }));
                                    }}
                                >
                                    Update credentials
                                </Button>
                            )}
                        </CardContent>
                        {catalogItem.gateway && (
                            <Dialog
                                open={activeMethod === catalogItem.method}
                                onOpenChange={(isOpen) => {
                                    setActiveMethod(
                                        isOpen ? catalogItem.method : null
                                    );
                                    if (isOpen) {
                                        setFormState((prev) => ({
                                            ...prev,
                                            [catalogItem.method]:
                                                prev[catalogItem.method] ??
                                                buildFormState(
                                                    catalogItem.method,
                                                    catalogItem.fields,
                                                    gatewayConfig ?? undefined
                                                )
                                        }));
                                    }
                                }}
                            >
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {isGatewayConnected
                                                ? "Update"
                                                : "Connect"}{" "}
                                            {catalogItem.label}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Add the API credentials from your{" "}
                                            {catalogItem.label} merchant
                                            dashboard. Credentials are stored
                                            securely and can be updated anytime.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`${catalogItem.method}-label`}
                                            >
                                                Label
                                            </Label>
                                            <Input
                                                id={`${catalogItem.method}-label`}
                                                placeholder={`${catalogItem.label} Primary`}
                                                value={
                                                    currentFormState?.label ??
                                                    ""
                                                }
                                                onChange={(event) =>
                                                    setFormState((prev) => {
                                                        const existingState =
                                                            getFormState(
                                                                prev,
                                                                catalogItem,
                                                                gatewayConfig ??
                                                                    undefined
                                                            );
                                                        return {
                                                            ...prev,
                                                            [catalogItem.method]:
                                                                {
                                                                    ...existingState,
                                                                    label: event
                                                                        .target
                                                                        .value
                                                                }
                                                        };
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between rounded-3xl border border-border bg-muted/30 px-3 py-2">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Test mode
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Use sandbox credentials for
                                                    test payments.
                                                </p>
                                            </div>
                                            <Switch
                                                checked={
                                                    currentFormState?.is_test_mode ??
                                                    false
                                                }
                                                onCheckedChange={(checked) =>
                                                    setFormState((prev) => {
                                                        const existingState =
                                                            getFormState(
                                                                prev,
                                                                catalogItem,
                                                                gatewayConfig ??
                                                                    undefined
                                                            );
                                                        return {
                                                            ...prev,
                                                            [catalogItem.method]:
                                                                {
                                                                    ...existingState,
                                                                    is_test_mode:
                                                                        checked
                                                                }
                                                        };
                                                    })
                                                }
                                            />
                                        </div>
                                        {catalogItem.fields.map((field) => (
                                            <div
                                                className="grid gap-2"
                                                key={field.key}
                                            >
                                                <Label
                                                    htmlFor={`${catalogItem.method}-${field.key}`}
                                                >
                                                    {field.label}
                                                </Label>
                                                <Input
                                                    id={`${catalogItem.method}-${field.key}`}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    type={field.type ?? "text"}
                                                    value={
                                                        currentFormState
                                                            ?.credentials[
                                                            field.key
                                                        ] ?? ""
                                                    }
                                                    onChange={(event) =>
                                                        setFormState((prev) => {
                                                            const existingState =
                                                                getFormState(
                                                                    prev,
                                                                    catalogItem,
                                                                    gatewayConfig ??
                                                                        undefined
                                                                );
                                                            return {
                                                                ...prev,
                                                                [catalogItem.method]:
                                                                    {
                                                                        ...existingState,
                                                                        credentials:
                                                                            {
                                                                                ...existingState.credentials,
                                                                                [field.key]:
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                            }
                                                                    }
                                                            };
                                                        })
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setActiveMethod(null)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={
                                                savingGateway ===
                                                catalogItem.method
                                            }
                                            onClick={async () => {
                                                if (!catalogItem.gateway)
                                                    return;
                                                const payload =
                                                    formState[
                                                        catalogItem.method
                                                    ];
                                                if (!payload) return;
                                                setSavingGateway(
                                                    catalogItem.method
                                                );
                                                const res =
                                                    await configurePaymentGateway(
                                                        shopId,
                                                        {
                                                            gateway:
                                                                catalogItem.gateway,
                                                            credentials:
                                                                payload.credentials,
                                                            is_test_mode:
                                                                payload.is_test_mode,
                                                            label: payload.label
                                                        }
                                                    );
                                                setSavingGateway(null);
                                                if (res.success) {
                                                    toast.success(
                                                        "Payment gateway connected"
                                                    );
                                                    setActiveMethod(null);
                                                    refreshData();
                                                } else {
                                                    toast.error(
                                                        "Failed to connect payment gateway"
                                                    );
                                                }
                                            }}
                                        >
                                            Save credentials
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
