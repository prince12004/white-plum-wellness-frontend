import { NextRequest, NextResponse } from 'next/server';

/**
 * UX-only guard for the /admin section specifically — redirects obviously-
 * unauthenticated visitors away from the admin dashboard before a page even
 * renders. This is NOT the security boundary; every real authorization decision
 * happens server-side via the API's guards (JwtAuthGuard/PermissionsGuard). A
 * forged or expired cookie here just means the user sees a slower redirect once
 * the API call in the admin layout 401s.
 *
 * Scoped to /admin/* only (see matcher below) — public site and customer-facing
 * routes (/, /login, /dashboard, etc.) are never touched by this check.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === '/admin/login';
  const hasAccessToken = request.cookies.has('access_token');

  if (!isAdminLogin && !hasAccessToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only ever runs for /admin/* pages — everything else (public site, customer
  // dashboard/login, /api/*, static files) is completely untouched.
  matcher: ['/admin/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)'],
};
