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

  // Production: read from private Blob store using SDK with auth token
  if (IS_PRODUCTION) {
    try {
      console.log(`[Blob Read] Reading "${key}" from private Blob store`);
      const { get } = await import('@vercel/blob');

      const result = await get(key, { access: 'private' });

      if (!result || !result.stream) {
        console.log(`[Blob Read] Blob "${key}" not found or no stream`);
        return null;
      }

      // Read from the stream
      const reader = result.stream.getReader();
      const decoder = new TextDecoder();
      let text = '';
      let chunk;
      while (!(chunk = await reader.read()).done) {
        text += decoder.decode(chunk.value, { stream: true });
      }
      text += decoder.decode(); // flush remaining

      console.log(`[Blob Read] Successfully read ${text.length} bytes`);
      const parsed = JSON.parse(text) as T;
      return parsed;
    } catch (err) {
      console.error(`[Blob Read] Error:`, err instanceof Error ? err.message : err);
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
