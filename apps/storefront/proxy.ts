import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. favicon.ico)
         */
        "/((?!api/|_next/|_static/|favicon.ico|[\\w-]+\\.\\w+).*)"
    ]
};

export default function proxy(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.mohajon.store, demo.localhost:3000)
    let hostname = req.headers
        .get("host")!
        .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_STORE_DOMAIN || "mohajon.store"}`);

    // In local development, you might access a specific port, e.g. localhost:3001
    hostname = hostname.replace(/:\d+$/, "");

    // Define allowed domains where the main marketing or auth apps live
    const rootDomains = [
        process.env.NEXT_PUBLIC_ROOT_DOMAIN || "mohajon.io",
        process.env.NEXT_PUBLIC_STORE_DOMAIN || "mohajon.store",
        "localhost"
    ];

    // Exclude our main domains
    const isRootDomain = rootDomains.includes(hostname);

    if (!isRootDomain) {
        // We assume it's a tenant subdomain or a custom domain.
        // e.g. Extract "demo" from demo.mohajon.io
        const subdomain = hostname.split(".")[0];

        // Rewrite path to match our internal routing structure for multi-tenant handling inside App Router
        // e.g. demo.mohajon.io/products -> /_sites/demo/products
        return NextResponse.rewrite(
            new URL(`/_sites/${subdomain}${url.pathname}`, req.url)
        );
    }

    // If it's a direct hit on the storefront container with a root domain (which shouldn't happen usually due to Traefik)
    // Let it pass or redirect to web domain.
    return NextResponse.next();
}
