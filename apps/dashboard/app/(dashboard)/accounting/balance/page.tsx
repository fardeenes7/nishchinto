import { requireActiveShopContext } from "@/lib/shop-context";
import { getMerchantBalance, getMerchantLedger } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { 
    IconWallet, 
    IconArrowUpRight, 
    IconHistory, 
    IconCurrencyTaka,
    IconClock
} from "@tabler/icons-react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@repo/ui/components/ui/table";

export default async function BalancePage() {
    const context = await requireActiveShopContext();
    const balanceRes = await getMerchantBalance(context.shopId);
    const ledgerRes = await getMerchantLedger(context.shopId);

    const balance = balanceRes.success ? balanceRes.data : {
        current_balance: "0.00",
        total_withdrawn: "0.00",
        pending_payouts: "0.00"
    };

    const ledger = ledgerRes.success ? ledgerRes.data.results : [];

    const getEntryTypeVariant = (type: string): "success" | "destructive" | "warning" | "secondary" | "outline" => {
        switch (type) {
            case "SALE": return "success";
            case "PAYOUT": return "destructive";
            case "REFUND": return "warning";
            case "ADJUSTMENT": return "secondary";
            default: return "outline";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Financial Balance</h1>
                    <p className="text-muted-foreground">Track your earnings, payouts, and ledger history.</p>
                </div>
                <Button className="gap-2">
                    <IconArrowUpRight className="size-4" />
                    Request Payout
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-80 flex items-center gap-2">
                            <IconWallet className="size-4" />
                            Current Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{balance.current_balance} {context.baseCurrency}</div>
                        <p className="text-xs opacity-60 mt-1">Available for withdrawal</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <IconHistory className="size-4" />
                            Total Withdrawn
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{balance.total_withdrawn} {context.baseCurrency}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <IconClock className="size-4" />
                            Pending Payouts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{balance.pending_payouts} {context.baseCurrency}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <IconHistory className="size-5" />
                        Ledger History
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="pr-6 text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledger.length > 0 ? (
                                ledger.map((entry: any) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="pl-6">
                                            <Badge variant={getEntryTypeVariant(entry.entry_type)}>
                                                {entry.entry_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {entry.description}
                                        </TableCell>
                                        <TableCell className={entry.amount > 0 ? "text-success" : "text-destructive"}>
                                            {entry.amount > 0 ? "+" : ""}{entry.amount} {context.baseCurrency}
                                        </TableCell>
                                        <TableCell className="pr-6 text-right text-xs text-muted-foreground">
                                            {new Date(entry.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No ledger entries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
