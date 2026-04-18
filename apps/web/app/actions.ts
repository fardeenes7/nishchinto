'use server';

/**
 * Server Actions for the marketing `web` app.
 *
 * Uses `publicFetch` — waitlist submission is unauthenticated and the
 * endpoint does not need to be cached (rate-limited by Redis on the backend).
 */

import { publicFetch, type ApiResponse } from '@repo/api/fetcher';

export type WaitlistActionState = {
    status: 'idle' | 'success' | 'error';
    message?: string;
};

export async function joinWaitlistAction(
    _prevState: WaitlistActionState,
    formData: FormData,
): Promise<WaitlistActionState> {
    const email        = formData.get('email') as string;
    const phone_number = formData.get('phone') as string;
    const businessName = formData.get('businessName') as string | null;
    const orders       = formData.get('orders') as string | null;

    if (!email || !phone_number) {
        return { status: 'error', message: 'Email and phone are required.' };
    }

    const res: ApiResponse = await publicFetch('/api/v1/marketing/waitlist/', {
        method: 'POST',
        body: {
            email,
            phone_number,
            survey_data: {
                business_name: businessName ?? '',
                estimated_monthly_orders: orders ?? '0-100',
            },
        },
        cache: 'no-store',
    });

    if (!res.success) {
        // res.error already extracted from Django DRF response by the fetcher
        return { status: 'error', message: res.error };
    }

    return { status: 'success' };
}
