import { getMedia } from "@/lib/api";
import { requireActiveShopContext } from "@/lib/shop-context";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { MediaGrid } from "./_components/MediaGrid";
import { UploadMediaDialog } from "./_components/UploadMediaDialog";
import { DynamicPagination } from "@/components/DynamicPagination";

export default async function MediaPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page ?? "1");
    const activeShop = await requireActiveShopContext();

    const result = await getMedia(activeShop.shopId, {
        page,
        page_size: 18,
        search: params.search
    });

    const items = result.success && result.data ? (Array.isArray(result.data) ? result.data : result.data.results || []) : [];
    const count = result.success && result.data ? result.data.count || items.length : 0;
    const numPages = result.success && result.data ? result.data.num_pages || Math.ceil(count / 18) || 1 : 1;

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all your uploaded images and files in one place.
                    </p>
                </div>
                <UploadMediaDialog shopId={activeShop.shopId} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-xs">
                <form className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        name="search"
                        placeholder="Search media by name..." 
                        className="pl-9 bg-muted/50 border-none"
                        defaultValue={params.search || ""}
                    />
                </form>
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                    <Filter size={16} />
                    Filters
                </Button>
            </div>

            <MediaGrid initialItems={items} shopId={activeShop.shopId} />

            {numPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 mt-6">
                    <p className="text-sm text-muted-foreground hidden sm:block">
                        Showing <span className="font-medium">{(page - 1) * 18 + 1}</span> to <span className="font-medium">{Math.min(page * 18, count)}</span> of <span className="font-medium">{count}</span> results
                    </p>
                    <DynamicPagination currentPage={page} totalPages={numPages} />
                </div>
            )}
        </div>
    );
}
