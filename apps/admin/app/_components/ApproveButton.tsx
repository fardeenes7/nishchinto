"use client";

/**
 * ApproveButton — Client Component
 *
 * Minimal client island. Only this button needs interactivity.
 * The full waitlist table is a Server Component (no client bundle).
 */

import { useActionState } from "react";
import { approveWaitlistEntryAction, type ApproveActionState } from "@/app/actions";

const initialState: ApproveActionState = { status: "idle" };

export function ApproveButton({ entryId }: { entryId: number }) {
    const [state, formAction, isPending] = useActionState(
        approveWaitlistEntryAction,
        initialState,
    );

    if (state.status === "success") {
        return (
            <span className="text-xs text-green-600 font-medium">
                ✓ Invite sent
            </span>
        );
    }

    return (
        <form action={formAction}>
            {/* Hidden field passes the entry ID to the Server Action */}
            <input type="hidden" name="entryId" value={entryId} />
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
