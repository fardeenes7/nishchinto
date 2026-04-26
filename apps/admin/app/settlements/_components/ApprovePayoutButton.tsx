"use client";

import { useActionState } from "react";
import { approveSettlementAction, type SettlementActionState } from "@/lib/api";

const initialState: SettlementActionState = { status: "idle" };

export function ApprovePayoutButton({ payoutId }: { payoutId: string }) {
    const [state, formAction, isPending] = useActionState(
        approveSettlementAction,
        initialState,
    );

    if (state.status === "success") {
        return (
            <span className="text-xs text-green-600 font-medium">
                ✓ Processing
            </span>
        );
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="payoutId" value={payoutId} />
            <div className="space-y-1">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    {isPending ? "Approving..." : "Approve"}
                </button>
                {state.status === "error" && (
                    <p className="text-xs text-destructive">{state.message}</p>
                )}
            </div>
        </form>
    );
}
