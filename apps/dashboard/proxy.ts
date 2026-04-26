import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const PUBLIC_PATHS = ["/login", "/api/public"];

export default auth((req: NextAuthRequest) => {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js)$/)
    ) {
        return NextResponse.next();
    }

    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    if (isPublicPath) {
        return NextResponse.next();
    }

    if (!req.auth) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("returnUrl", pathname);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});
