'use client';

import { Player, Goal } from '@/data/types';
import { calculateGoalsByPosition } from '@/lib/stats';

const POSITION_COLORS: Record<string, string> = {
  DEF: '#10b981',
  MED: '#0ea5e9',
  DEL: '#f43f5e',
};

const POSITION_LABELS: Record<string, string> = {
  DEF: 'Defensores',
  MED: 'Mediocampistas',
  DEL: 'Delanteros',
};

interface Props {
  players: Player[];
  goals: Goal[];
}

export default function GoalsByPositionChart({ players, goals }: Props) {
  const positions = calculateGoalsByPosition(goals, players);
  const total = positions.reduce((sum, p) => sum + p.count, 0);

  // Filter out positions with 0 goals
  const activePositions = positions.filter(p => p.count > 0);

  // Calculate pie chart segments
  let currentAngle = -90; // Start from top
  const segments = activePositions.map(pos => {
    const percentage = total > 0 ? pos.count / total : 0;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    return { ...pos, startAngle, endAngle };
  });

  const drawPieSlice = (startAngle: number, endAngle: number, radius: number, color: string) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);
    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const pathData = [
      `M 100 100`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return (
      <path key={`${startAngle}-${endAngle}`} d={pathData} fill={color} opacity="0.9" />
    );
  };

  return (
    <div className="bg-[#11296B]/40 border border-white/10 rounded-xl p-5 hover:bg-[#1a3a8f]/40 transition-colors">
      <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-4">
        Goles por Posición
      </p>

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Pie Chart */}
        <svg width="180" height="180" viewBox="0 0 200 200" className="flex-shrink-0">
          {segments.map(seg => drawPieSlice(seg.startAngle, seg.endAngle, 80, POSITION_COLORS[seg.position]))}
          <circle cx="100" cy="100" r="50" fill="#0A1A3E" />
          <text
            x="100"
            y="105"
            textAnchor="middle"
            className="font-black text-xl"
            fill="white"
          >
            {total}
          </text>
        </svg>

        {/* Legend */}
        <div className="space-y-3 flex-1">
          {activePositions.map(pos => (
            <div key={pos.position} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: POSITION_COLORS[pos.position] }}
                />
                <span className="text-white/70 text-sm">{POSITION_LABELS[pos.position]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{pos.count}</span>
                <span className="text-[#F5A623] font-semibold text-sm">{pos.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
