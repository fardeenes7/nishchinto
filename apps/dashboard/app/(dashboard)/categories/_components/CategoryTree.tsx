"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  IconEdit,
  IconTrash,
  IconChevronRight,
  IconFolder,
  IconFolderOpen,
} from "@tabler/icons-react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
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
import { CategoryForm } from "./CategoryForm";
import { deleteCategory } from "@/lib/api";
import type { Category } from "@repo/api";


interface CategoryTreeProps {
  categories: Category[];
  shopId: string;
}

interface CategoryRowProps {
  category: Category;
  allCategories: Category[];
  children: Category[];
  depth: number;
  shopId: string;
}

function CategoryRow({
  category,
  allCategories,
  children,
  depth,
  shopId,
}: CategoryRowProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(false);

  const hasChildren = children.length > 0;

  const handleDelete = async () => {
    const res = await deleteCategory(shopId, category.id);
    if (res.success) {
      toast.success(`"${category.name}" deleted.`);
      startTransition(() => router.refresh());
    } else {
      toast.error(res.error ?? "Failed to delete category.");
    }
    setDeleteTarget(false);
  };

  return (
    <>
      <div
        className="flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-muted/50 group transition-colors"
        style={{ paddingLeft: `${12 + depth * 24}px` }}
      >
        {/* Expand/collapse toggle */}
        <button
          type="button"
          className="size-4 shrink-0 text-muted-foreground"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Collapse" : "Expand"}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            expanded ? (
              <IconChevronRight className="size-4 rotate-90 transition-transform" />
            ) : (
              <IconChevronRight className="size-4 transition-transform" />
            )
          ) : (
            <span className="size-4 inline-block" />
          )}
        </button>

        {/* Icon */}
        {hasChildren && expanded ? (
          <IconFolderOpen className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <IconFolder className="size-4 shrink-0 text-muted-foreground" />
        )}

        {/* Name */}
        <span className="flex-1 text-sm font-medium truncate">
          {category.name}
        </span>

        {/* Badges */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!category.is_active && (
            <Badge variant="secondary" className="text-xs">
              Inactive
            </Badge>
          )}
          {hasChildren && (
            <Badge variant="outline" className="text-xs tabular-nums">
              {children.length} sub
            </Badge>
          )}

          {/* Actions */}
          <Button
            id={`edit-category-${category.id}`}
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setEditOpen(true)}
          >
            <IconEdit className="size-3.5" />
            <span className="sr-only">Edit {category.name}</span>
          </Button>
          <Button
            id={`delete-category-${category.id}`}
            variant="ghost"
            size="icon"
            className="size-7 text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(true)}
          >
            <IconTrash className="size-3.5" />
            <span className="sr-only">Delete {category.name}</span>
          </Button>
        </div>

        {/* Static badges always visible */}
        {!category.is_active && (
          <Badge
            variant="secondary"
            className="text-xs group-hover:hidden"
          >
            Inactive
          </Badge>
        )}
      </div>

      {/* Recursive children */}
      {hasChildren && expanded && (
        <div>
          {children.map((child) => (
            <CategoryRow
              key={child.id}
              category={child}
              allCategories={allCategories}
              children={allCategories.filter((c) => c.parent === child.id)}
              depth={depth + 1}
              shopId={shopId}
            />
          ))}
        </div>
      )}

      {/* Edit Sheet */}
      <CategoryForm
        category={category}
        allCategories={allCategories}
        shopId={shopId}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{category.name}&quot; will be soft-deleted. Products in this
              category will become uncategorised. Subcategories will remain but
              lose their parent reference.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function CategoryTree({ categories, shopId }: CategoryTreeProps) {
  // Root-level categories (no parent)
  const roots = categories.filter((c) => !c.parent);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 gap-3 text-center">
        <IconFolder className="size-10 text-muted-foreground" />
        <div>
          <p className="font-medium">No categories yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first category to organise your products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border divide-y">
      {roots.map((root) => (
        <CategoryRow
          key={root.id}
          category={root}
          allCategories={categories}
          children={categories.filter((c) => c.parent === root.id)}
          depth={0}
          shopId={shopId}
        />
      ))}
    </div>
  );
}
