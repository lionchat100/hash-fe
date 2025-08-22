import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWLIST = [
  /^\/_next\//, // 정적 리소스
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
  /^\/healthz$/, // 헬스체크용
];

export const config = {
  matcher: [
    '/onboarding/:path*',
    '/explore/:path*',
    '/chats/:path*',
    '/feed/:path*',
    '/profile/:path*',
    '/((?!api/healthz).*)',
  ],
};

function isMaintenance(req: NextRequest) {
  const byEnv = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';
  const byCookie = req.cookies.get('force_maintenance')?.value === '1'; // 로컬 테스트용
  return byEnv || byCookie;
}

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (isMaintenance(request)) {
    const pass = ALLOWLIST.some((re) => re.test(pathname));
    if (!pass) {
      return new NextResponse(
        `<!doctype html><html><head><meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <title>점검 중</title></head>
         <body style="font:18px/1.2 system-ui;display:grid;place-items:center;height:100vh;margin:0;color:#2F2E2D">
           <main style="text-align:center">
           <img src="/images/logo/tokit_heart.svg" alt="Loading" style="width:140px;height:134px;"/>
             <h1 style="margin:24px 0 12px;font-size: 30px;line-height:120%;">잠시 서버 점검 중입니다</h1>
             <p>서버 점검으로 인해 접속이 불가하오니<br/>많은 양해 부탁드립니다</p>
           </main>
         </body></html>`,
        {
          status: 503,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store',
            'Retry-After': '3600', // 1시간 후 재시도 권고
          },
        },
      );
    }
  }

  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (!refreshToken) {
    if (pathname === '/') return NextResponse.next();

    const loginUrl = new URL('/', origin);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
