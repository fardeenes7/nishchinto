/**
 * Internal helpers for the fetcher package.
 */

export function resolveBody(body: any): {
    resolvedBody: BodyInit | null | undefined;
    inferredContentType: string | undefined;
} {
    if (body === undefined || body === null) {
        return { resolvedBody: undefined, inferredContentType: undefined };
    }

    // Native body types — pass through unchanged
    if (
        typeof body === 'string' ||
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof ReadableStream ||
        ArrayBuffer.isView(body)
    ) {
        return { resolvedBody: body as BodyInit, inferredContentType: undefined };
    }

    // Plain object or array — serialize as JSON
    return {
        resolvedBody: JSON.stringify(body),
        inferredContentType: 'application/json',
    };
}

export function getBaseUrl(): string {
    const url = process.env.API_BASE_URL;
    if (!url) {
        throw new Error(
            '[fetcher] API_BASE_URL is not set.'
        );
    }
    return url.replace(/\/+$/, '');
}

export function normaliseEndpoint(endpoint: string): string {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

export function headersToObject(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

export function extractDjangoError(data: unknown, fallback: string): string {
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        if (typeof obj['detail'] === 'string') return obj['detail'];
        if (typeof obj['message'] === 'string') return obj['message'];
        const firstField = Object.values(obj)[0];
        if (Array.isArray(firstField) && typeof firstField[0] === 'string') {
            return firstField[0];
        }
    }
    return fallback;
}
