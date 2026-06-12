'use client';

import { Goal } from '@/data/types';
import { calculateGoalsByType } from '@/lib/stats';

const TYPE_COLORS: Record<string, string> = {
  'Ataque rapido': '#fbbf24',
  'Balon parado': '#60a5fa',
  'Ataque organizado': '#a78bfa',
  'Recuperacion': '#34d399',
  'Penal': '#f87171',
};

const TYPE_LABELS: Record<string, string> = {
  'Ataque rapido': 'Ataque rápido',
  'Balon parado': 'Balón parado',
  'Ataque organizado': 'Organizado',
  'Recuperacion': 'Recuperación',
  'Penal': 'Penal',
};

interface Props {
  goals: Goal[];
}

export default function GoalsByTypeChart({ goals }: Props) {
  const types = calculateGoalsByType(goals);
  const maxCount = Math.max(...types.map(t => t.count), 1);

  return (
    <div className="bg-[#11296B]/40 border border-white/10 rounded-xl p-5 hover:bg-[#1a3a8f]/40 transition-colors">
      <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-5">
        Goles por Tipo
      </p>

      <div className="space-y-4">
        {types.map(type => {
          const percentage = (type.count / maxCount) * 100;
          const color = TYPE_COLORS[type.type] || '#666';

          return (
            <div key={type.type} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">{TYPE_LABELS[type.type] || type.type}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{type.count}</span>
                  <span className="text-[#F5A623] font-semibold">{type.percentage}%</span>
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
