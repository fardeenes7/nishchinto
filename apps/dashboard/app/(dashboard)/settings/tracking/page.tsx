import type { Metadata } from "next";
import { getTrackingConfig } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";
import { TrackingConfigForm } from "./TrackingConfigForm";

export const metadata: Metadata = {
  title: "Tracking & Pixels | Nishchinto Dashboard",
};

const MOCK_SHOP_ID = process.env.MOCK_SHOP_ID ?? "";

export default async function TrackingConfigPage() {
  const res = await getTrackingConfig(MOCK_SHOP_ID);

  if (!res.success) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>{res.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tracking & Pixels</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure marketing pixels to track conversions and optimize your ads.
        </p>
      </div>

      <Alert>
        <IconInfoCircle className="size-4" />
        <AlertTitle>Requires Basic Plan</AlertTitle>
        <AlertDescription>
          Tracking pixels are available on the Basic plan and above. Scripts
          are injected into your storefront automatically.
        </AlertDescription>
      </Alert>

      <TrackingConfigForm shopId={MOCK_SHOP_ID} initialData={res.data} />
    </div>
  );
}
