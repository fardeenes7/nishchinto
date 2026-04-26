"use client";

import React, { useEffect, useState } from "react";
import { getPaymentMethods, updatePaymentMethod } from "@/lib/api";
import { Switch } from "@repo/ui/components/ui/switch";
import { Label } from "@repo/ui/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { IconCreditCard, IconCash, IconBuildingBank, IconWallet } from "@tabler/icons-react";
import { toast } from "sonner";

export function PaymentMethodList({ shopId }: { shopId: string }) {
    const [methods, setMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMethods = async () => {
            const res = await getPaymentMethods(shopId);
            if (res.success) {
                setMethods(res.data);
            }
            setLoading(false);
        };
        fetchMethods();
    }, [shopId]);

    const handleToggle = async (methodId: string, isEnabled: boolean) => {
        const res = await updatePaymentMethod(shopId, methodId, { is_enabled: isEnabled });
        if (res.success) {
            setMethods(methods.map(m => m.id === methodId ? { ...m, is_enabled: isEnabled } : m));
            toast.success("Payment method updated");
        } else {
            toast.error("Failed to update payment method");
        }
    };

    const getIcon = (method: string) => {
        switch (method) {
            case "COD": return <IconCash className="size-5" />;
            case "BKASH": return <IconWallet className="size-5" />;
            case "BANK_TRANSFER": return <IconBuildingBank className="size-5" />;
            default: return <IconCreditCard className="size-5" />;
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid gap-4">
            {methods.map((method) => (
                <Card key={method.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                {getIcon(method.method)}
                            </div>
                            <div>
                                <CardTitle className="text-base">{method.method_display}</CardTitle>
                                <CardDescription>
                                    {method.method === "COD" ? "Accept cash at delivery" : "Online payment gateway"}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch 
                                id={`switch-${method.id}`}
                                checked={method.is_enabled}
                                onCheckedChange={(checked) => handleToggle(method.id, checked)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            {method.fee_payer === "MERCHANT" ? (
                                <Badge variant="outline">Merchant absorbs fee</Badge>
                            ) : (
                                <Badge variant="outline">Customer pays fee</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
