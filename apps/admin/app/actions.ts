'use server';

/**
 * Server Actions for the internal `admin` app.
 *
 * Uses `apiFetch` — admin endpoints require JWT auth (is_staff=True).
 * These endpoints must NEVER be cached across users.
 */

import { apiFetch } from '@repo/api/auth-fetcher';

export type ApproveActionState = {
    status: 'idle' | 'success' | 'error';
    message?: string;
};

/**
 * Approve a waitlist entry. Triggers Celery task to dispatch invite email.
 */
export async function approveWaitlistEntryAction(
    _prevState: ApproveActionState,
    formData: FormData,
): Promise<ApproveActionState> {
    const entryId = formData.get('entryId') as string;

    if (!entryId) {
        return { status: 'error', message: 'Missing entry ID.' };
    }

    const res = await apiFetch(`/api/v1/marketing/waitlist/${entryId}/approve/`, {
        method: 'POST',
        cache: 'no-store',
    });

    if (!res.success) {
        return { status: 'error', message: res.error };
    }

    return { status: 'success', message: 'Approved — invite email dispatched.' };
}
