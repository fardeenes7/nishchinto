import type { Metadata } from "next";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@repo/ui/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";
import { getSocialConnections } from "@/lib/api";
import { handleSocialOAuthCallback } from "@/lib/api";
import { requireActiveShopContext } from "@/lib/shop-context";
import { SocialConnectionsPanel } from "./SocialConnectionsPanel";
import { Button } from "@repo/ui/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@repo/ui/components/ui/card";
import {
    completeSocialOAuthSelectionAction,
    startSocialOAuthAction,
} from "./actions";

export const metadata: Metadata = {
    title: "Social Connections | Nishchinto Dashboard",
};

export default async function SocialConnectionsPage({
    searchParams,
}: {
    searchParams: Promise<{ code?: string; state?: string }>;
}) {
    const activeShop = await requireActiveShopContext();
    const params = await searchParams;

    let oauthStateForSelection: string | null = null;
    let oauthPages: Array<{ id: string; name: string }> = [];

    if (params.code && params.state) {
        const oauthRes = await handleSocialOAuthCallback(activeShop.shopId, {
            code: params.code,
            state: params.state,
        });
        if (oauthRes.success) {
            oauthStateForSelection = oauthRes.data.oauth_state ?? null;
            oauthPages = oauthRes.data.pages ?? [];
        }
    }

    const connectionsRes = await getSocialConnections(activeShop.shopId);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold">Social Connections</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Connect Meta pages and manage social publishing health.
                </p>
            </div>

            <Alert>
                <IconInfoCircle className="size-4" />
                <AlertTitle>Token lifecycle is monitored</AlertTitle>
                <AlertDescription>
                    Expired page tokens are marked and social publishing is
                    paused until reconnect.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle>OAuth Connect</CardTitle>
                    <CardDescription>
                        Connect Meta via OAuth and choose a managed page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form action={startSocialOAuthAction}>
                        <input
                            type="hidden"
                            name="shopId"
                            value={activeShop.shopId}
                        />
                        <Button type="submit">Connect with Meta OAuth</Button>
                    </form>

                    {oauthStateForSelection && oauthPages.length > 0 ? (
                        <form
                            action={completeSocialOAuthSelectionAction}
                            className="flex items-center gap-3"
                        >
                            <input
                                type="hidden"
                                name="shopId"
                                value={activeShop.shopId}
                            />
                            <input
                                type="hidden"
                                name="oauthState"
                                value={oauthStateForSelection}
                            />
                            <select
                                name="selectedPageId"
                                required
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select page to connect
                                </option>
                                {oauthPages.map((page) => (
                                    <option key={page.id} value={page.id}>
                                        {page.name}
                                    </option>
                                ))}
                            </select>
                            <Button type="submit" variant="outline">
                                Save Selected Page
                            </Button>
                        </form>
                    ) : null}
                </CardContent>
            </Card>

            <SocialConnectionsPanel
                shopId={activeShop.shopId}
                initialConnections={
                    connectionsRes.success ? connectionsRes.data : []
                }
            />
        </div>
    );
}
