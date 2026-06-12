import { Player, Match, Goal } from '@/data/types';

export interface SeasonStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  winPercentage: number;
  totalGoalsFor: number;
  totalGoalsAgainst: number;
  goalDifferential: number;
  avgGoalsPerMatch: number;
}

export interface GoalsByPosition {
  position: 'DEF' | 'MED' | 'DEL';
  count: number;
  percentage: number;
}

export interface GoalsByType {
  type: string;
  count: number;
  percentage: number;
}

export interface GoalsByMatchType {
  type: string;
  count: number;
  matches: number;
  avgPerMatch: number;
}

export interface MonthlyData {
  month: string;
  goals: number;
}

export function calculateSeasonStats(matches: Match[], goals: Goal[]): SeasonStats {
  const totalMatches = matches.length;
  const wins = matches.filter(m => m.outcome === 'V').length;
  const draws = matches.filter(m => m.outcome === 'E').length;
  const losses = matches.filter(m => m.outcome === 'D').length;
  const winPercentage = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  const totalGoalsFor = matches.reduce((sum, m) => sum + m.goalsFor, 0);
  const totalGoalsAgainst = matches.reduce((sum, m) => sum + m.goalsAgainst, 0);
  const goalDifferential = totalGoalsFor - totalGoalsAgainst;
  const avgGoalsPerMatch = totalMatches > 0 ? (totalGoalsFor / totalMatches).toFixed(1) : '0';

  return {
    totalMatches,
    wins,
    draws,
    losses,
    winPercentage,
    totalGoalsFor,
    totalGoalsAgainst,
    goalDifferential,
    avgGoalsPerMatch: parseFloat(avgGoalsPerMatch as string),
  };
}

export function countStartersVsBench(goals: Goal[], matches: Match[]): {
  starters: number;
  bench: number;
  startersPercentage: number;
  benchPercentage: number;
} {
  let starters = 0;
  let bench = 0;

  goals.forEach(goal => {
    const match = matches.find(m => m.id === goal.matchId);
    if (match) {
      if (match.lineup.includes(goal.scorer)) {
        starters++;
      } else if (match.bench.includes(goal.scorer)) {
        bench++;
      }
    }
  });

  const total = starters + bench;
  const startersPercentage = total > 0 ? Math.round((starters / total) * 100) : 0;
  const benchPercentage = total > 0 ? Math.round((bench / total) * 100) : 0;

  return { starters, bench, startersPercentage, benchPercentage };
}

export function calculateGoalsByPosition(
  goals: Goal[],
  players: Player[]
): GoalsByPosition[] {
  const positionMap: Record<string, number> = { DEF: 0, MED: 0, DEL: 0, POR: 0 };

  goals.forEach(goal => {
    const player = players.find(p => p.name === goal.scorer);
    if (player) {
      positionMap[player.position]++;
    }
  });

  const total = Object.values(positionMap).reduce((sum, count) => sum + count, 0);
  const positions: GoalsByPosition[] = [];

  ['DEF', 'MED', 'DEL'].forEach(pos => {
    const count = positionMap[pos];
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    positions.push({
      position: pos as 'DEF' | 'MED' | 'DEL',
      count,
      percentage,
    });
  });

  return positions;
}

export function calculateGoalsByType(goals: Goal[]): GoalsByType[] {
  const typeMap: Record<string, number> = {};

  goals.forEach(goal => {
    typeMap[goal.type] = (typeMap[goal.type] || 0) + 1;
  });

  const total = Object.values(typeMap).reduce((sum, count) => sum + count, 0);
  const types: GoalsByType[] = [];

  Object.entries(typeMap).forEach(([type, count]) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    types.push({ type, count, percentage });
  });

  return types.sort((a, b) => b.count - a.count);
}

export function calculateGoalsByMatchType(
  goals: Goal[],
  matches: Match[]
): GoalsByMatchType[] {
  const matchTypeGoals: Record<string, number> = {};
  const matchTypeCounts: Record<string, number> = {};

  // Count goals and matches per type
  matches.forEach(match => {
    matchTypeCounts[match.type] = (matchTypeCounts[match.type] || 0) + 1;
  });

  goals.forEach(goal => {
    const match = matches.find(m => m.id === goal.matchId);
    if (match) {
      matchTypeGoals[match.type] = (matchTypeGoals[match.type] || 0) + 1;
    }
  });

  const types: GoalsByMatchType[] = [];

  ['Liga', 'Copa', 'Amistoso'].forEach(type => {
    const count = matchTypeGoals[type] || 0;
    const matchCount = matchTypeCounts[type] || 0;
    const avgPerMatch = matchCount > 0 ? parseFloat((count / matchCount).toFixed(2)) : 0;
    types.push({ type, count, matches: matchCount, avgPerMatch });
  });

  return types;
}

export function calculateWinStreak(matches: Match[]): { current: number; best: number } {
  let current = 0;
  let best = 0;

  const sortedMatches = [...matches].sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });

  let currentStreak = 0;
  let bestStreak = 0;

  sortedMatches.forEach(match => {
    if (match.outcome === 'V') {
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  });

  current = currentStreak;
  best = bestStreak;

  return { current, best };
}

export function calculateMonthlyTrend(goals: Goal[]): MonthlyData[] {
  const monthMap: Record<string, number> = {};

  goals.forEach(goal => {
    const [day, month, year] = goal.date.split('/');
    const monthKey = `${month}/${year}`;
    monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
  });

  const months = ['03/2026', '04/2026', '05/2026'];
  const trend: MonthlyData[] = [];

  months.forEach(month => {
    const [m] = month.split('/');
    const monthName = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][parseInt(m)];
    trend.push({
      month: monthName,
      goals: monthMap[month] || 0,
    });
  });

  return trend;
}
