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

  // Production: read from public Blob store
  if (IS_PRODUCTION) {
    try {
      const storeId = process.env.BLOB_STORE_ID;
      if (!storeId) {
        console.log(`[Blob Read] BLOB_STORE_ID not configured, using static files`);
        return null;
      }

      const blobUrl = `https://${storeId}.public.blob.vercelusercontent.com/${key}`;
      console.log(`[Blob Read] Fetching "${key}" from public Blob: ${blobUrl}`);

      const res = await fetch(blobUrl);
      if (!res.ok) {
        console.log(`[Blob Read] Blob fetch failed: ${res.status}`);
        return null;
      }

      const text = await res.text();
      console.log(`[Blob Read] Successfully read ${text.length} bytes from public Blob`);
      const parsed = JSON.parse(text) as T;
      return parsed;
    } catch (err) {
      console.error(`[Blob Read] Error reading from public Blob:`, err);
      return null;
    }
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
