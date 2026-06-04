import path from 'path';
import { Player, Match, Goal } from '@/data/types';

async function readRuntime<T>(filename: string): Promise<T | null> {
  try {
    const fs = await import('fs/promises');
    const filePath = path.join(process.cwd(), 'src', 'data', 'runtime', filename);
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getPlayers(): Promise<Player[]> {
  return (await readRuntime<Player[]>('players.json')) ?? (await import('@/data/players')).players;
}

export async function getMatches(): Promise<Match[]> {
  return (await readRuntime<Match[]>('matches.json')) ?? (await import('@/data/matches')).matches;
}

export async function getGoals(): Promise<Goal[]> {
  return (await readRuntime<Goal[]>('goals.json')) ?? (await import('@/data/goals')).goals;
}
