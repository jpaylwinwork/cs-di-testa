'use client';

import { Player, Match, Goal } from '@/data/types';
import SeasonOverviewGrid from './SeasonOverview/SeasonOverviewGrid';
import StartersVsBenchCard from './AttackAnalysis/StartersVsBenchCard';
import GoalsByPositionChart from './AttackAnalysis/GoalsByPositionChart';
import GoalsByTypeChart from './AttackAnalysis/GoalsByTypeChart';
import WinStreakCard from './PerformancePatterns/WinStreakCard';
import GoalsByMatchTypeChart from './PerformancePatterns/GoalsByMatchTypeChart';
import MonthlyTrendChart from './PerformancePatterns/MonthlyTrendChart';

interface Props {
  players: Player[];
  matches: Match[];
  goals: Goal[];
}

export default function TeamStats({ players, matches, goals }: Props) {
  return (
    <div className="space-y-8">
      {/* Season Overview */}
      <section className="space-y-3">
        <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold px-1">
          Resumen Temporada
        </h2>
        <SeasonOverviewGrid matches={matches} goals={goals} />
      </section>

      {/* Attack Analysis */}
      <section className="space-y-3">
        <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold px-1">
          Análisis de Ataque
        </h2>
        <div className="space-y-4">
          {/* Starters vs Bench */}
          <StartersVsBenchCard goals={goals} matches={matches} />

          {/* Goals by Position & Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GoalsByPositionChart players={players} goals={goals} />
            <GoalsByTypeChart goals={goals} />
          </div>
        </div>
      </section>

      {/* Performance Patterns */}
      <section className="space-y-3">
        <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold px-1">
          Patrones de Rendimiento
        </h2>
        <div className="space-y-4">
          {/* Win Streak */}
          <WinStreakCard matches={matches} />

          {/* Goals by Match Type & Monthly Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GoalsByMatchTypeChart goals={goals} matches={matches} />
            <MonthlyTrendChart goals={goals} />
          </div>
        </div>
      </section>
    </div>
  );
}
