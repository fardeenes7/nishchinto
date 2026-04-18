/**
 * Admin Waitlist Page — Server Component (RSC)
 *
 * Data is fetched server-side using apiFetch from @repo/api.
 * No `useEffect`, no `useState`, no `fetch()` in Client Components.
 * The approve action is handled by a Client Component that calls a Server Action.
 */

import { Suspense } from 'react';
import { apiFetch } from '@repo/api/auth-fetcher';
import { ApproveButton } from './_components/ApproveButton';

export const metadata = {
    title: 'Waitlist Management — Nishchinto Admin',
};

interface WaitlistEntry {
    id: number;
    email: string;
    phone_number: string;
    status: string;
    survey_data: {
        business_name?: string;
        estimated_monthly_orders?: string;
        current_platform?: string;
    };
    created_at: string;
}

/**
 * Server-side data fetch using the authenticated fetcher.
 * JWT is read from the `access_token` cookie by apiFetch automatically.
 * cache: 'no-store' ensures each admin request always gets fresh data.
 */
async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
    const res = await apiFetch<WaitlistEntry[]>('/api/v1/marketing/waitlist/admin/', {
        cache: 'no-store',
    });

    if (!res.success) {
        // Propagate to the nearest error.tsx boundary
        throw new Error(res.error);
    }

    return res.data;
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        APPROVED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        CLAIMED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] ?? 'bg-muted text-muted-foreground'}`}>
            {status}
        </span>
    );
}

async function WaitlistTable() {
    const entries = await getWaitlistEntries();

    if (entries.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                No waitlist entries yet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Phone</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Business Name</th>
                        <th className="px-6 py-3">Monthly Orders</th>
                        <th className="px-6 py-3">Joined</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <tr key={entry.id} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-medium">{entry.email}</td>
                            <td className="px-6 py-4 text-muted-foreground">{entry.phone_number}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={entry.status} />
                            </td>
                            <td className="px-6 py-4">{entry.survey_data?.business_name ?? '—'}</td>
                            <td className="px-6 py-4">{entry.survey_data?.estimated_monthly_orders ?? '—'}</td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {new Date(entry.created_at).toLocaleDateString('en-GB')}
                            </td>
                            <td className="px-6 py-4">
                                {/* Approve action lives in a Client Component to enable
                                    useActionState for pending/error feedback. */}
                                {entry.status === 'PENDING' && (
                                    <ApproveButton entryId={entry.id} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function AdminWaitlistPage() {
    return (
        <main className="p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Waitlist</h1>
                    <p className="text-muted-foreground mt-1">
                        Review and approve merchant beta applications.
                    </p>
                </div>
            </div>

            {/* Suspense lets the table stream in while the rest of the shell renders */}
            <Suspense fallback={
                <div className="text-center py-16 text-muted-foreground">
                    Loading waitlist...
                </div>
            }>
                <WaitlistTable />
            </Suspense>
        </main>
    );
}
