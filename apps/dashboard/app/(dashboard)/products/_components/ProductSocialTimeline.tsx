import { Badge } from "@repo/ui/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@repo/ui/components/ui/card";
import type { ProductSocialPostLog } from "@repo/api";

interface ProductSocialTimelineProps {
    items: ProductSocialPostLog[];
}

export function ProductSocialTimeline({ items }: ProductSocialTimelineProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Social Activity</CardTitle>
                <CardDescription>
                    Recent publishing attempts for this product.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No social activity yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-md border p-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium">
                                        {item.connection_page_name}
                                    </p>
                                    <Badge
                                        variant={
                                            item.status === "SUCCESS"
                                                ? "default"
                                                : item.status === "FAILED"
                                                  ? "destructive"
                                                  : "secondary"
                                        }
                                    >
                                        {item.status}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Retries: {item.retry_count} • Published:{" "}
                                    {item.published_at ?? "Pending"}
                                </p>
                                {item.error_message && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {item.error_message}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
