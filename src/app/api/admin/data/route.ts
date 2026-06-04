import { NextResponse } from 'next/server';
import { getPlayers, getMatches, getGoals } from '@/lib/getData';

export async function GET() {
  const [players, matches, goals] = await Promise.all([
    getPlayers(),
    getMatches(),
    getGoals(),
  ]);
  return NextResponse.json({ players, matches, goals });
}
