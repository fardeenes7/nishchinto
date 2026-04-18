'use server';

/**
 * Server Actions for the `dashboard` app.
 *
 * The claim endpoint is unauthenticated (the invite token IS the credential),
 * so we use `publicFetch`. All subsequent authenticated dashboard actions
 * will use `apiFetch` once the JWT is issued post-login.
 */

import { publicFetch } from '@repo/api/fetcher';

export type ClaimActionState = {
    status: 'idle' | 'success' | 'error';
    message?: string;
};

export async function claimShopAction(
    _prevState: ClaimActionState,
    formData: FormData,
): Promise<ClaimActionState> {
    const token     = formData.get('token') as string;
    const subdomain = formData.get('subdomain') as string;
    const password  = formData.get('password') as string;

    // Basic server-side validation before hitting the network
    if (!token || !subdomain || !password) {
        return { status: 'error', message: 'All fields are required.' };
    }
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
        return { status: 'error', message: 'Subdomain may only contain lowercase letters, numbers, and hyphens.' };
    }
    if (password.length < 8) {
        return { status: 'error', message: 'Password must be at least 8 characters.' };
    }

    const res = await publicFetch('/api/v1/shops/claim/', {
        method: 'POST',
        body: { token, subdomain, password },
        cache: 'no-store',
    });

    if (!res.success) {
        return { status: 'error', message: res.error };
    }

    return { status: 'success' };
}
