import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/public", "/api/auth",];

/**
 * Next.js 16 Middleware (proxy.ts)
 * Handles global authentication and public path routing.
 */
const proxy = auth((req) => {
    const { pathname } = req.nextUrl;

    // 1. Allow public paths
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
    if (isPublicPath) {
        return NextResponse.next();
    }

    // 2. Check session (req is augmented by auth() in NextAuth v5)
    const session = req.auth;

    if (!session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("returnUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

// Explicitly cast to any to fix TS2883: "The inferred type of 'default' cannot be named..."
// This is a known issue with NextAuth v5's complex return types in some environments.
export default proxy as any;

export const config = {
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (local image assets)
     */
    matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};

