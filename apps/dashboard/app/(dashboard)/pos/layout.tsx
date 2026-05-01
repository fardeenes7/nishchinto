import { SidebarProvider } from "@repo/ui/components/ui/sidebar";

export default function POSLayout({ children }: { children: React.ReactNode }) {
    // POS often needs more screen real estate.
    // We keep the SidebarProvider but might default it to collapsed or use a custom header.
    return (
        <div className="full-screen flex h-screen overflow-hidden bg-muted/20">
            <main className="flex-1 flex flex-col min-w-0">{children}</main>
        </div>
    );
}
