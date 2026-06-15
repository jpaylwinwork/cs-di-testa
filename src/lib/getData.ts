import { Player, Match, Goal } from '@/data/types';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ── Read from Vercel Blob (production) or local JSON (development) ──────────

async function readBlob<T>(key: string): Promise<T | null> {
  // Production: use Vercel Blob with OIDC
  if (IS_PRODUCTION) {
    try {
      const { list } = await import('@vercel/blob');
      // OIDC automatically provides authentication
      const { blobs } = await list();
      const match = blobs.find(b => b.pathname === key);
      if (!match) return null;

      // Fetch the blob data
      const res = await fetch(match.downloadUrl);
      if (!res.ok) return null;
      const text = await res.text();
      return JSON.parse(text) as T;
    } catch (err) {
      console.error(`Error reading ${key} from Blob:`, err);
      return null;
    }
  }

  // Development: use local filesystem
  try {
    const fs   = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'src', 'data', 'runtime', `${key}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as T;
    // Return only if data is non-empty array or object with content
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    if (!Array.isArray(parsed) && Object.keys(parsed as any).length > 0) return parsed;
    return null; // Return null for empty arrays/objects to trigger fallback
  } catch {
    return null;
  }
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
