import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. favicon.ico)
     */
    "/((?!api/|_next/|_static/|favicon.ico|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. demo.nishchinto.com.bd, nishchinto.com.bd)
  let hostname = req.headers.get("host")!.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // In local development, you might access a specific port, e.g. localhost:3001
  hostname = hostname.replace(/:\d+$/, "");

  // Define allowed domains where the main marketing or auth apps live
  const rootDomains = ["nishchinto.com.bd", "localhost"];
  
  // Exclude our main domains
  const isRootDomain = rootDomains.includes(hostname);

  if (!isRootDomain) {
    // We assume it's a tenant subdomain or a custom domain.
    // e.g. Extract "demo" from demo.nishchinto.com.bd
    const subdomain = hostname.split(".")[0];
    
    // Rewrite path to match our internal routing structure for multi-tenant handling inside App Router
    // e.g. demo.nishchinto.com.bd/products -> /_sites/demo/products
    return NextResponse.rewrite(new URL(`/_sites/${subdomain}${url.pathname}`, req.url));
  }

  // If it's a direct hit on the storefront container with a root domain (which shouldn't happen usually due to Traefik)
  // Let it pass or redirect to landing domain.
  return NextResponse.next();
}
