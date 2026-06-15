import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPlayers, getMatches, getGoals } from '@/lib/getData';

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'csdt-admin-2026';

export async function GET() {
  // Check authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token || token.value !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [players, matches, goals] = await Promise.all([
    getPlayers(),
    getMatches(),
    getGoals(),
  ]);
  return NextResponse.json({ players, matches, goals });
}
