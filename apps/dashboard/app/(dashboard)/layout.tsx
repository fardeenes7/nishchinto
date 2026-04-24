import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@repo/ui/components/ui/breadcrumb";
import { requireActiveShopContext } from "@/lib/shop-context";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
import { IconAlertTriangle, IconLock } from "@tabler/icons-react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await requireActiveShopContext();
  const { subscription } = context;

  const isSuspended = subscription.status === "SUSPENDED" || subscription.status === "GRACE";
  const isComplianceLocked = subscription.status === "COMPLIANCE_LOCK";

  return (
    <SidebarProvider>
      <AppSidebar context={context} />
      <SidebarInset>
        {isSuspended && (
          <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
            <IconAlertTriangle className="size-4" />
            <span>{subscription.suspension_banner || "⚠️ Service Paused — Payment Issue"}</span>
            <Button variant="link" size="sm" className="text-destructive-foreground underline p-0 h-auto" asChild>
                <Link href="/settings/billing">Resolve Now</Link>
            </Button>
          </div>
        )}
        {isComplianceLocked && (
          <div className="bg-warning text-warning-foreground px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
            <IconLock className="size-4" />
            <span>🔒 Account Under Review — Quota Exceeded</span>
            <Button variant="link" size="sm" className="text-warning-foreground underline p-0 h-auto" asChild>
                <Link href="/products">Manage Inventory</Link>
            </Button>
          </div>
        )}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
