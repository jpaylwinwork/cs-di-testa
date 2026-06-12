'use client';

import { Match, Goal } from '@/data/types';
import { calculateSeasonStats } from '@/lib/stats';
import SeasonStatsCard from './SeasonStatsCard';

interface Props {
  matches: Match[];
  goals: Goal[];
}

export default function SeasonOverviewGrid({ matches, goals }: Props) {
  const stats = calculateSeasonStats(matches, goals);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <SeasonStatsCard
        label="Partidos"
        value={stats.totalMatches}
        highlight
      />
      <SeasonStatsCard
        label="Récord"
        value={`${stats.wins}V ${stats.draws}E ${stats.losses}D`}
        subtext={`${stats.winPercentage}% ganadas`}
      />
      <SeasonStatsCard
        label="Goles a Favor"
        value={stats.totalGoalsFor}
        highlight
      />
      <SeasonStatsCard
        label="Goles en Contra"
        value={stats.totalGoalsAgainst}
      />
      <SeasonStatsCard
        label="Diferencia de Goles"
        value={stats.goalDifferential > 0 ? `+${stats.goalDifferential}` : stats.goalDifferential}
        highlight={stats.goalDifferential > 0}
      />
      <SeasonStatsCard
        label="Promedio por Partido"
        value={stats.avgGoalsPerMatch}
        subtext="goles/partido"
      />
    </div>
  );
}
