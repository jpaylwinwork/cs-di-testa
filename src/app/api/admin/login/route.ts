import { NextResponse } from 'next/server';

const ADMIN_USER   = process.env.ADMIN_USER   ?? 'cachetoro';
const ADMIN_PASS   = process.env.ADMIN_PASS   ?? 'cacheto14';
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'csdt-admin-2026';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_token', ADMIN_SECRET, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}
