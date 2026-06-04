import { Player, Match, Goal } from '@/data/types';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// ── Read from Vercel Blob (production) or local JSON (development) ──────────

async function readBlob<T>(key: string): Promise<T | null> {
  // Production: use Vercel Blob
  if (BLOB_TOKEN) {
    try {
      const { list, head } = await import('@vercel/blob');
      const { blobs } = await list({ prefix: key, token: BLOB_TOKEN });
      const match = blobs.find(b => b.pathname === key);
      if (!match) return null;
      const res = await fetch(match.url);
      if (!res.ok) return null;
      return res.json() as Promise<T>;
    } catch {
      return null;
    }
  }

  // Development: use local filesystem
  try {
    const fs   = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'src', 'data', 'runtime', `${key}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getPlayers(): Promise<Player[]> {
  return (await readBlob<Player[]>('players')) ?? (await import('@/data/players')).players;
}

export async function getMatches(): Promise<Match[]> {
  return (await readBlob<Match[]>('matches')) ?? (await import('@/data/matches')).matches;
}

export async function getGoals(): Promise<Goal[]> {
  return (await readBlob<Goal[]>('goals')) ?? (await import('@/data/goals')).goals;
}
