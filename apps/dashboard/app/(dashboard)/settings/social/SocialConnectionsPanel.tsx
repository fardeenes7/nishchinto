import { Button } from "@repo/ui/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import type { SocialConnection } from "@repo/api";
import {
    createSocialConnectionAction,
    disconnectSocialConnectionAction,
} from "./actions";

interface SocialConnectionsPanelProps {
    shopId: string;
    initialConnections: SocialConnection[];
}

export function SocialConnectionsPanel({
    shopId,
    initialConnections,
}: SocialConnectionsPanelProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Connect Meta Page</CardTitle>
                    <CardDescription>
                        Add a page access token to enable product posting
                        automation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-4"
                        action={createSocialConnectionAction}
                    >
                        <input type="hidden" name="shopId" value={shopId} />
                        <div className="space-y-2">
                            <Label htmlFor="meta-page-id">Page ID</Label>
                            <Input id="meta-page-id" name="pageId" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta-page-name">Page Name</Label>
                            <Input
                                id="meta-page-name"
                                name="pageName"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta-access-token">
                                Page Access Token
                            </Label>
                            <Input
                                id="meta-access-token"
                                name="accessToken"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta-expires-in">
                                Expires In (seconds)
                            </Label>
                            <Input
                                id="meta-expires-in"
                                name="expiresIn"
                                type="number"
                                min={0}
                                defaultValue={"5184000"}
                            />
                        </div>
                        <Button type="submit">Connect Page</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Connected Pages</CardTitle>
                    <CardDescription>
                        Current social destinations available for publishing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {initialConnections.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No connections yet.
                        </p>
                    ) : (
                        initialConnections.map((connection) => (
                            <div
                                key={connection.id}
                                className="rounded-md border p-3"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium">
                                            {connection.page_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Page ID: {connection.page_id}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            connection.status === "ACTIVE"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {connection.status}
                                    </Badge>
                                </div>
                                <Separator className="my-3" />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                        Token expiry:{" "}
                                        {connection.token_expires_at ??
                                            "Unknown"}
                                    </span>
                                    <form
                                        action={
                                            disconnectSocialConnectionAction
                                        }
                                    >
                                        <input
                                            type="hidden"
                                            name="shopId"
                                            value={shopId}
                                        />
                                        <input
                                            type="hidden"
                                            name="connectionId"
                                            value={connection.id}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="submit"
                                        >
                                            Disconnect
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
