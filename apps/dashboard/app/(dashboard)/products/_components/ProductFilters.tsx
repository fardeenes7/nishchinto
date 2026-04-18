"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

const STATUSES = [
  { value: "all", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "ARCHIVED", label: "Archived" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") ?? "all";
  const currentSearch = searchParams.get("search") ?? "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset pagination
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Input
        id="product-search"
        placeholder="Search products..."
        defaultValue={currentSearch}
        className="max-w-xs"
        onChange={(e) => {
          const val = e.target.value;
          if (val.length === 0 || val.length >= 3) {
            updateParam("search", val);
          }
        }}
      />
      <Select
        value={currentStatus}
        onValueChange={(val) => updateParam("status", val)}
      >
        <SelectTrigger id="product-status-filter" className="w-44">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
