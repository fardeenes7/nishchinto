import { Badge } from "@repo/ui/components/ui/badge";

type ProductStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "SCHEDULED"
  | "OUT_OF_STOCK"
  | "ARCHIVED";

const STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "default" },
  SCHEDULED: { label: "Scheduled", variant: "outline" },
  OUT_OF_STOCK: { label: "Out of Stock", variant: "destructive" },
  ARCHIVED: { label: "Archived", variant: "secondary" },
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
