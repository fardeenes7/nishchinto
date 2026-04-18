"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconDotsVertical,
  IconWorldUpload,
  IconArchive,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { ProductStatusBadge } from "./ProductStatusBadge";
import type { ProductListItem } from "@repo/api";
import { deleteProduct, publishProduct, archiveProduct } from "@repo/api";

interface ProductTableProps {
  products: ProductListItem[];
  shopId: string;
  isLoading?: boolean;
}

function formatPrice(price: string) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(parseFloat(price));
}

export function ProductTable({
  products,
  shopId,
  isLoading,
}: ProductTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<ProductListItem | null>(null);

  const handlePublish = async (product: ProductListItem) => {
    const res = await publishProduct(shopId, product.id);
    if (res.success) {
      toast.success(`"${product.name}" is now published.`);
      startTransition(() => router.refresh());
    } else {
      toast.error(res.error);
    }
  };

  const handleArchive = async (product: ProductListItem) => {
    const res = await archiveProduct(shopId, product.id);
    if (res.success) {
      toast.success(`"${product.name}" has been archived.`);
      startTransition(() => router.refresh());
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteProduct(shopId, deleteTarget.id);
    if (res.success) {
      toast.success(`"${deleteTarget.name}" has been deleted.`);
      setDeleteTarget(null);
      startTransition(() => router.refresh());
    } else {
      toast.error(res.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 gap-4 text-center">
        <div className="flex flex-col gap-1">
          <p className="font-medium">No products yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first product to start selling.
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new">Add Product</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="size-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover size-10"
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">No img</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="font-medium hover:underline truncate max-w-xs"
                    >
                      {product.name}
                    </Link>
                    {product.category_name && (
                      <span className="text-xs text-muted-foreground">
                        {product.category_name}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {product.sku || "—"}
                  </code>
                </TableCell>
                <TableCell>
                  <ProductStatusBadge status={product.status} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={
                      product.total_stock === 0 ? "text-destructive" : ""
                    }
                  >
                    {product.total_stock}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <div className="flex flex-col items-end">
                    <span>{formatPrice(product.base_price)}</span>
                    {product.compare_at_price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        id={`product-actions-${product.id}`}
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <IconDotsVertical className="size-4" />
                        <span className="sr-only">Actions for {product.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product.id}/edit`}>
                          <IconEdit data-icon="inline-start" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {product.status === "DRAFT" && (
                        <DropdownMenuItem
                          onClick={() => handlePublish(product)}
                        >
                          <IconWorldUpload data-icon="inline-start" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {product.status === "PUBLISHED" && (
                        <DropdownMenuItem
                          onClick={() => handleArchive(product)}
                        >
                          <IconArchive data-icon="inline-start" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <IconTrash data-icon="inline-start" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteTarget?.name}&quot; will be soft-deleted and removed
              from your storefront. This action can be undone by contacting
              support.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
