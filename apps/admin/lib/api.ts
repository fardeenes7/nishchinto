'use server';

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { fetcher, type ApiResponse } from "@repo/api";

/**
 * The admin-specific authFetcher wrapper.
 * Admin endpoints require JWT auth (is_staff=True).
 */
export async function authFetcher<T = any>(
    url: string,
    options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
        queryParams?: any;
    } = {}
): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, queryParams } = options;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value ?? cookieStore.get("nishchinto_jwt")?.value;

    const mergedHeaders = { ...headers };
    if (token) {
        mergedHeaders["Authorization"] = `Bearer ${token}`;
    }

    return fetcher<T>(url, method, body, mergedHeaders, queryParams);
}

// ─── Waitlist API ────────────────────────────────────────────────────────────

export interface WaitlistEntry {
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

export async function getWaitlistEntries() {
    return authFetcher<WaitlistEntry[]>("/api/v1/marketing/admin/waitlist/");
}


export type ApproveActionState = {
    status: 'idle' | 'success' | 'error';
    message?: string;
};

/**
 * Server Action: Approve a waitlist entry. 
 * Triggers Celery task to dispatch invite email.
 */
export async function approveWaitlistAction(
    _prevState: ApproveActionState,
    formData: FormData,
): Promise<ApproveActionState> {
    const entryId = formData.get('entryId') as string;

    if (!entryId) {
        return { status: 'error', message: 'Missing entry ID.' };
    }

    const res = await authFetcher(`/api/v1/marketing/admin/waitlist/${entryId}/approve/`, {
        method: 'POST',
    });


    if (!res.success) {
        return { status: 'error', message: res.error };
    }

    revalidatePath('/');
    return { status: 'success', message: 'Approved — invite email dispatched.' };
}
