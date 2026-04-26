"use client";

import { useActionState } from "react";
import { rejectSettlementAction, type SettlementActionState } from "@/lib/api";

const initialState: SettlementActionState = { status: "idle" };

export function RejectPayoutButton({ payoutId }: { payoutId: string }) {
    const [state, formAction, isPending] = useActionState(
        rejectSettlementAction,
        initialState,
    );

    if (state.status === "success") {
        return (
            <span className="text-xs text-red-600 font-medium">✓ Rejected</span>
        );
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="payoutId" value={payoutId} />
            <div className="space-y-1">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-3 py-1.5 bg-destructive text-destructive-foreground text-xs rounded-md hover:opacity-90 disabled:opacity-50 transition-colors"
                >
                    {isPending ? "Rejecting..." : "Reject"}
                </button>
                {state.status === "error" && (
                    <p className="text-xs text-destructive">{state.message}</p>
                )}
            </div>
        </form>
    );
}
