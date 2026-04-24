import { NextRequest, NextResponse } from 'next/server';

// List of public paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/_next', '/api/public', '/favicon.ico'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path)) || 
                       pathname.match(/\.(.*)$/); // Match static files with extensions

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 2. Check for authentication cookies
  // We check for both 'access_token' (standard) and 'nishchinto_jwt' (project specific)
  const token = request.cookies.get('access_token')?.value || 
                request.cookies.get('nishchinto_jwt')?.value;

  if (!token) {
    // 3. Redirect to login if token is missing
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Continue to the requested page
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
