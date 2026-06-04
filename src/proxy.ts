import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'csdt-admin-2026';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token');
    if (!token || token.value !== ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
