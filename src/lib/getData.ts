import { Player, Match, Goal } from '@/data/types';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// ── Read from Vercel Blob (production) or local JSON (development) ──────────

async function readBlob<T>(key: string): Promise<T | null> {
  // Development: try to read from local filesystem first
  if (!IS_PRODUCTION) {
    try {
      const fs   = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'src', 'data', 'runtime', `${key}.json`);
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as T;
      // Return only if data is non-empty
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      if (!Array.isArray(parsed) && Object.keys(parsed as any).length > 0) return parsed;
      return null;
    } catch {
      return null;
    }
  }

  // Production: Blob store is currently private, so reads fail
  // Once store is changed to public via Vercel dashboard, will be able to read
  if (IS_PRODUCTION) {
    console.log(`[Blob Read] Blob store is private - using static files as fallback`);
    return null;
  }

  return null;
}

export async function getPlayers(): Promise<Player[]> {
  const fromBlob = await readBlob<Player[]>('players');
  if (fromBlob) return fromBlob;

  // Force fresh import by bypassing Node's require cache
  delete require.cache[require.resolve('@/data/players')];
  return (await import('@/data/players')).players;
}

export async function getMatches(): Promise<Match[]> {
  const fromBlob = await readBlob<Match[]>('matches');
  if (fromBlob) return fromBlob;

  delete require.cache[require.resolve('@/data/matches')];
  return (await import('@/data/matches')).matches;
}

export async function getGoals(): Promise<Goal[]> {
  const fromBlob = await readBlob<Goal[]>('goals');
  if (fromBlob) return fromBlob;

  delete require.cache[require.resolve('@/data/goals')];
  return (await import('@/data/goals')).goals;
}
