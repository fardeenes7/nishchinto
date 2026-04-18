import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const defaultLocale = "bn";
const locales = ["bn", "en"];

export function proxy(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;

    // Skip next internal paths and static assets
    if (pathname.startsWith("/_next") || pathname.includes(".")) {
        return NextResponse.next();
    }

    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return NextResponse.next();

    // Redirect if there is no locale
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    // e.g. incoming request is /about
    // The new URL is now /bn/about
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!_next).*)"
    ]
};
