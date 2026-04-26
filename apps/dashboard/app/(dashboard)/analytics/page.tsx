import { getActiveShopContext, getSalesAnalytics, getTopCustomers, getCohortAnalytics } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { SalesChart } from "@/components/analytics/SalesChart";
import { LTVTable } from "@/components/analytics/LTVTable";
import { CohortChart } from "@/components/analytics/CohortChart";
import { requireActiveShopContext } from "@/lib/shop-context";

export default async function AnalyticsPage() {
    // We use requireActiveShopContext to ensure we have a shop selected
    const context = await requireActiveShopContext();
    const shopId = context.shopId;

    const [salesRes, customersRes, cohortsRes] = await Promise.all([
        getSalesAnalytics(shopId),
        getTopCustomers(shopId),
        getCohortAnalytics(shopId),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Deep insights into your store's performance and customer behavior.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Sales Over Time</CardTitle>
                        <CardDescription>Daily revenue from delivered orders.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart data={salesRes.data || []} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Customers (LTV)</CardTitle>
                        <CardDescription>Highest value customers based on completed orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LTVTable customers={customersRes.data || []} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer Cohorts</CardTitle>
                    <CardDescription>Monthly signup trends and retention.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CohortChart data={cohortsRes.data || []} />
                </CardContent>
            </Card>
        </div>
    );
}
