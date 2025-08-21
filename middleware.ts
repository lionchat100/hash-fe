import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/onboarding/:path*', '/explore/:path*', '/chats/:path*', '/feed/:path*', '/profile/:path*'],
};

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (!refreshToken) {
    if (pathname === '/') return NextResponse.next();

    const loginUrl = new URL('/', origin);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
