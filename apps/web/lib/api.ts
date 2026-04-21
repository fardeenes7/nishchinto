'use server';

/**
 * Web App API helpers — App Router Server-side only.
 */

import { fetcher, type ApiResponse } from "@repo/api";

export async function publicFetch<T = any>(
    url: string,
    options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
        queryParams?: any;
    } = {}
): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers, queryParams } = options;
    return fetcher<T>(url, method, body, headers, queryParams);
}

// ─── Waitlist API ────────────────────────────────────────────────────────────

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

    const res = await publicFetch('/api/v1/marketing/waitlist/', {
        method: 'POST',
        body: {
            email,
            phone_number,
            survey_data: {
                business_name: businessName ?? '',
                estimated_monthly_orders: orders ?? '0-100',
            },
        },
    });

    if (!res.success) {
        return { status: 'error', message: res.error };
    }

    return { status: 'success' };
}
