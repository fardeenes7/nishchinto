"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@repo/ui/components/ui/button";
import { CategoryForm } from "./CategoryForm";
import type { Category } from "@repo/api";

interface NewCategoryButtonProps {
  categories: Category[];
  shopId: string;
}

export function NewCategoryButton({ categories, shopId }: NewCategoryButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button id="new-category-btn" onClick={() => setOpen(true)}>
        <IconPlus data-icon="inline-start" />
        New Category
      </Button>
      <CategoryForm
        allCategories={categories}
        shopId={shopId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
