"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Trash2, Download, Eye, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function MediaGrid({
    initialItems,
    shopId
}: {
    initialItems: any[];
    shopId: string;
}) {
    const [items, setItems] = useState(initialItems);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            const res = await fetch(`/api/proxy/media/${id}/`, {
                method: "DELETE",
                headers: { "X-Tenant-ID": shopId }
            });
            if (res.ok) {
                toast.success("Media deleted successfully");
                setItems((prev) => prev.filter((item) => item.id !== id));
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.detail || "Failed to delete media.");
            }
        } catch (error) {
            toast.error("Network error deleting media.");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div>
            {items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group relative rounded-xl border bg-muted/30 overflow-hidden aspect-square flex flex-col"
                        >
                            <div className="relative flex-1 overflow-hidden bg-muted flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {item.cdn_url ? (
                                    <img
                                        src={item.cdn_url}
                                        alt={item.original_filename}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className="text-muted-foreground text-xs">
                                        {item.mime_type || "File"}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-9 w-9 rounded-full hover:scale-110 transition-transform"
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-9 w-9 rounded-full hover:scale-110 transition-transform"
                                            onClick={() =>
                                                window.open(
                                                    item.cdn_url,
                                                    "_blank"
                                                )
                                            }
                                        >
                                            <Download size={16} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="h-9 w-9 rounded-full hover:scale-110 transition-transform"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            disabled={isDeleting === item.id}
                                        >
                                            {isDeleting === item.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t bg-card flex flex-col gap-1">
                                <p
                                    className="text-xs font-medium truncate text-foreground"
                                    title={item.original_filename}
                                >
                                    {item.original_filename}
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] text-muted-foreground">
                                        {item.file_size
                                            ? `${(item.file_size / 1024 / 1024).toFixed(2)} MB`
                                            : "Unknown size"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {item.created_at
                                            ? new Date(
                                                  item.created_at
                                              ).toLocaleDateString()
                                            : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-50 flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed bg-card">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No media found</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                        We couldn't find any media.
                    </p>
                </div>
            )}
        </div>
    );
}
