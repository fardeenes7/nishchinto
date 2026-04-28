import { requireActiveShopContext } from "@/lib/shop-context";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Badge } from "@repo/ui/components/ui/badge";
import {
    IconKey,
    IconPlus,
    IconWebhook,
    IconTrash,
    IconCopy,
    IconExternalLink,
    IconAlertCircle
} from "@tabler/icons-react";
import { Separator } from "@repo/ui/components/ui/separator";

export default async function DeveloperApiPage() {
    const context = await requireActiveShopContext();
    const { shop, subscription } = context;

    // In a real app, we'd fetch tokens and webhooks here via server actions
    // For this demonstration, we'll show the UI structure

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Developer API
                    </h1>
                    <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                    >
                        {subscription.tier}
                    </Badge>
                </div>
                <p className="text-muted-foreground">
                    Connect your {shop.name} data to external B2B systems via
                    our REST API.
                </p>
            </header>

            <div className="grid gap-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <IconKey className="size-5 text-primary" />
                                API Access Tokens
                            </CardTitle>
                            <CardDescription>
                                Secure SHA-256 hashed keys to authenticate your
                                requests.
                            </CardDescription>
                        </div>
                        <Button size="sm" className="gap-2">
                            <IconPlus className="size-4" />
                            Generate Token
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border bg-muted/30">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Last Used
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b last:border-0">
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    ERP Integration
                                                </span>
                                                <code className="text-xs text-muted-foreground">
                                                    nsc_****7a8b
                                                </code>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-muted-foreground">
                                            2 hours ago
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <IconTrash className="size-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 items-start">
                            <IconAlertCircle className="size-5 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                Tokens are only shown once when generated. We
                                never store raw keys, only their secure hashes.
                                If you lose a key, you must revoke and
                                regenerate it.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <IconWebhook className="size-5 text-primary" />
                                Outbound Webhooks
                            </CardTitle>
                            <CardDescription>
                                Receive real-time CloudEvents when orders are
                                created or updated.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <IconPlus className="size-4" />
                            Add Endpoint
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            https://api.myerp.com/webhooks
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] uppercase"
                                        >
                                            Active
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px]"
                                        >
                                            order.created
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px]"
                                        >
                                            order.shipped
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-primary/10"
                                    >
                                        <IconCopy className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <IconTrash className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-3">
                                API Documentation
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a
                                    href="https://docs.mohajon.io/api-reference"
                                    target="_blank"
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            REST API Reference
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Authentication & Core Endpoints
                                        </span>
                                    </div>
                                    <IconExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                                <a
                                    href="https://docs.mohajon.io/webhooks"
                                    target="_blank"
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            Webhook Specs
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Payload formats & signing logic
                                        </span>
                                    </div>
                                    <IconExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
