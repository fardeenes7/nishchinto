import { getStoreTheme } from "@/lib/api";
import { BuilderWorkspace } from "@/components/builder/BuilderWorkspace";

export default async function BuilderPage() {
    const res = await getStoreTheme();
    const theme = res.success ? res.data : null;

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col w-full">
            <BuilderWorkspace initialTheme={theme} />
        </div>
    );
}
