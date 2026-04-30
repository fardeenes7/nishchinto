import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const defaultLocale = "bn";
const locales = ["bn", "en"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If it has a locale, check if it's the default one
    if (pathnameHasLocale) {
        // If it's the default locale (bn), redirect to the clean URL
        if (
            pathname.startsWith(`/${defaultLocale}/`) ||
            pathname === `/${defaultLocale}`
        ) {
            const newPath = pathname.replace(`/${defaultLocale}`, "") || "/";
            return NextResponse.redirect(new URL(newPath, request.url));
        }
        return NextResponse.next();
    }

    // Rewrite to default locale internally (URL stays clean)
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!_next|api|favicon.ico).*)"
    ]
};
