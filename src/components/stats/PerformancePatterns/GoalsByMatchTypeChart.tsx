'use client';

import { Goal, Match } from '@/data/types';
import { calculateGoalsByMatchType } from '@/lib/stats';

const TYPE_COLORS: Record<string, string> = {
  Liga: '#0ea5e9',
  Copa: '#fbbf24',
  Amistoso: '#d1d5db',
};

interface Props {
  goals: Goal[];
  matches: Match[];
}

export default function GoalsByMatchTypeChart({ goals, matches }: Props) {
  const types = calculateGoalsByMatchType(goals, matches);
  const maxAvg = Math.max(...types.map(t => t.avgPerMatch), 1);

  return (
    <div className="bg-[#11296B]/40 border border-white/10 rounded-xl p-5 hover:bg-[#1a3a8f]/40 transition-colors">
      <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-5">
        Goles por Tipo de Partido
      </p>

      <div className="space-y-4">
        {types.map(type => {
          const percentage = (type.avgPerMatch / maxAvg) * 100;
          const color = TYPE_COLORS[type.type] || '#666';

          return (
            <div key={type.type} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">{type.type}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{type.avgPerMatch}</span>
                  <span className="text-white/40 text-xs">({type.matches} partidos)</span>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
