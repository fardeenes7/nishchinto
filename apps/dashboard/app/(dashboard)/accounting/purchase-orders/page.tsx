import { requireActiveShopContext } from "@/lib/shop-context";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { 
    IconBox, 
    IconPlus, 
    IconTruckDelivery,
    IconDotsVertical,
    IconCalendar
} from "@tabler/icons-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@repo/ui/components/ui/dropdown-menu";

export default async function PurchaseOrdersPage() {
    const context = await requireActiveShopContext();
    const { shop } = context;

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
                    <p className="text-muted-foreground">Manage inventory acquisitions and track stock costs.</p>
                </div>
                <Button className="gap-2">
                    <IconPlus className="size-4" />
                    Create Purchase Order
                </Button>
            </header>

            <div className="grid gap-4">
                <Card className="border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <IconBox className="size-5 text-primary" />
                                    PO-1002 — Dhaka Wholesale Hub
                                </CardTitle>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <IconCalendar className="size-3.5" />
                                        Created: 2026-04-20
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <IconTruckDelivery className="size-3.5" />
                                        Estimated: 2026-04-25
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Ordered</Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <IconDotsVertical className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Mark as Received</DropdownMenuItem>
                                        <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Cancel PO</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-y">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Item</th>
                                    <th className="px-4 py-2 text-right font-medium">Qty</th>
                                    <th className="px-4 py-2 text-right font-medium">Unit Cost</th>
                                    <th className="px-4 py-2 text-right font-medium">Line Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b last:border-0">
                                    <td className="px-4 py-3">Premium Cotton T-Shirt (Black / L)</td>
                                    <td className="px-4 py-3 text-right">50</td>
                                    <td className="px-4 py-3 text-right">450.00 ৳</td>
                                    <td className="px-4 py-3 text-right font-medium">22,500.00 ৳</td>
                                </tr>
                                <tr className="border-b last:border-0">
                                    <td className="px-4 py-3">Premium Cotton T-Shirt (White / M)</td>
                                    <td className="px-4 py-3 text-right">30</td>
                                    <td className="px-4 py-3 text-right">450.00 ৳</td>
                                    <td className="px-4 py-3 text-right font-medium">13,500.00 ৳</td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-muted/20">
                                <tr>
                                    <td colSpan={3} className="px-4 py-3 text-right font-medium">Order Total</td>
                                    <td className="px-4 py-3 text-right font-bold text-lg text-primary">36,000.00 ৳</td>
                                </tr>
                            </tfoot>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
