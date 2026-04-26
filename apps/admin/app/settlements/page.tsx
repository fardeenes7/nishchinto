import { Suspense } from "react";
import { getSettlementPayouts, type SettlementPayout } from "@/lib/api";
import { ApprovePayoutButton } from "./_components/ApprovePayoutButton";
import { RejectPayoutButton } from "./_components/RejectPayoutButton";

export const metadata = {
    title: "Settlement Dashboard — Nishchinto Admin",
};

function StatusBadge({ status }: { status: SettlementPayout["status"] }) {
    const colors: Record<SettlementPayout["status"], string> = {
        PENDING:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        PROCESSING:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        REVERSED:
            "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
    };

    return (
        <span
            className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}
        >
            {status}
        </span>
    );
}

async function SettlementTable() {
    const res = await getSettlementPayouts();
    if (!res.success) throw new Error(res.error);
    const payouts = res.data;

    if (payouts.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                No payout requests yet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3">Shop</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Requested</th>
                        <th className="px-6 py-3">Note</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payouts.map((payout) => (
                        <tr
                            key={payout.id}
                            className="border-b hover:bg-muted/30 transition-colors"
                        >
                            <td className="px-6 py-4 font-medium">
                                {payout.shop_name}
                            </td>
                            <td className="px-6 py-4">৳ {payout.amount}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={payout.status} />
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {new Date(payout.created_at).toLocaleDateString(
                                    "en-GB",
                                )}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {payout.admin_note || "—"}
                            </td>
                            <td className="px-6 py-4">
                                {payout.status === "PENDING" ? (
                                    <div className="flex items-center gap-2">
                                        <ApprovePayoutButton
                                            payoutId={payout.id}
                                        />
                                        <RejectPayoutButton
                                            payoutId={payout.id}
                                        />
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        No actions
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function SettlementsPage() {
    return (
        <main className="p-8 space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Settlements
                </h1>
                <p className="text-muted-foreground mt-1">
                    Review payout requests and approve/reject transfers.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="text-center py-16 text-muted-foreground">
                        Loading settlements...
                    </div>
                }
            >
                <SettlementTable />
            </Suspense>
        </main>
    );
}
