import { requireActiveShopContext } from "@/lib/shop-context";
import { getFraudConfig, updateFraudConfig } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Switch } from "@repo/ui/components/ui/switch";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { 
    IconShieldLock, 
    IconUsersGroup, 
    IconAlertTriangle, 
    IconBan,
    IconInfoCircle
} from "@tabler/icons-react";
import { revalidatePath } from "next/cache";

export default async function FraudSettingsPage() {
    const context = await requireActiveShopContext();
    const configRes = await getFraudConfig(context.shopId);

    if (!configRes.success) {
        return <div>Error loading fraud configuration.</div>;
    }

    const config = configRes.data;

    async function handleUpdate(formData: FormData) {
        "use server";
        const context = await requireActiveShopContext();
        
        const data = {
            opt_in_pooling: formData.get("opt_in_pooling") === "on",
            block_high_risk: formData.get("block_high_risk") === "on",
            warn_on_rto: formData.get("warn_on_rto") === "on",
            rto_threshold: parseInt(formData.get("rto_threshold") as string) || 3,
        };

        await updateFraudConfig(context.shopId, data);
        revalidatePath("/settings/fraud");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Fraud Protection</h1>
                <p className="text-muted-foreground">Configure automated defenses against fraudulent orders and high-RTO customers.</p>
            </div>

            <form action={handleUpdate} className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <IconUsersGroup className="size-5 text-primary" />
                            <CardTitle className="text-lg">Network Intelligence</CardTitle>
                        </div>
                        <CardDescription>
                            Share and receive anonymized fraud data with the Nishchinto network to detect bad actors early.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="opt_in_pooling">Opt-in to Fraud Pooling</Label>
                                <p className="text-xs text-muted-foreground">
                                    Your data stays anonymous. You gain access to global blacklists.
                                </p>
                            </div>
                            <Switch id="opt_in_pooling" name="opt_in_pooling" defaultChecked={config.opt_in_pooling} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <IconShieldLock className="size-5 text-primary" />
                            <CardTitle className="text-lg">Automated Blocking</CardTitle>
                        </div>
                        <CardDescription>
                            Define how the system should handle high-risk orders.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="block_high_risk">Block High Risk Customers</Label>
                                <p className="text-xs text-muted-foreground">
                                    Automatically disable COD for customers flagged as high risk.
                                </p>
                            </div>
                            <Switch id="block_high_risk" name="block_high_risk" defaultChecked={config.block_high_risk} />
                        </div>

                        <div className="flex items-center justify-between space-x-2 border-t pt-6">
                            <div className="space-y-0.5">
                                <Label htmlFor="warn_on_rto">RTO Warning</Label>
                                <p className="text-xs text-muted-foreground">
                                    Show a warning during checkout for customers with multiple previous returns.
                                </p>
                            </div>
                            <Switch id="warn_on_rto" name="warn_on_rto" defaultChecked={config.warn_on_rto} />
                        </div>

                        <div className="space-y-2 max-w-xs border-t pt-6">
                            <Label htmlFor="rto_threshold">RTO Count Threshold</Label>
                            <Input 
                                id="rto_threshold" 
                                name="rto_threshold" 
                                type="number" 
                                defaultValue={config.rto_threshold} 
                                min={1}
                            />
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <IconInfoCircle className="size-3" />
                                Trigger warning after this many returns.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>

            <Card className="border-amber-500/20 bg-amber-500/5">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-700">
                        <IconAlertTriangle className="size-4" />
                        About High Risk Detection
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-amber-600/80 leading-relaxed">
                        Nishchinto's fraud engine uses machine learning to analyze order patterns, phone number age, 
                        and historical return data across all participating shops. When a customer is flagged, 
                        we recommend requiring advance payment (bKash/SSLCommerz) rather than Cash on Delivery.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
