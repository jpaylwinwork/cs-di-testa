'use client';

import { Goal } from '@/data/types';
import { calculateMonthlyTrend } from '@/lib/stats';

interface Props {
  goals: Goal[];
}

export default function MonthlyTrendChart({ goals }: Props) {
  const trend = calculateMonthlyTrend(goals);
  const maxGoals = Math.max(...trend.map(t => t.goals), 5);

  // Calculate line path
  const width = 280;
  const height = 180;
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const points = trend.map((item, index) => {
    const x = padding + (index / (trend.length - 1)) * graphWidth;
    const y = padding + graphHeight - (item.goals / maxGoals) * graphHeight;
    return { x, y, ...item };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="bg-[#11296B]/40 border border-white/10 rounded-xl p-5 hover:bg-[#1a3a8f]/40 transition-colors">
      <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-5">
        Tendencia Mensual
      </p>

      <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[1, 2, 3, 4].map(i => (
          <line
            key={`grid-${i}`}
            x1={padding}
            y1={padding + (i * graphHeight) / 4}
            x2={width - padding}
            y2={padding + (i * graphHeight) / 4}
            stroke="white"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="white" strokeOpacity="0.2" strokeWidth="1" />

        {/* X-axis */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="white" strokeOpacity="0.2" strokeWidth="1" />

        {/* Fill area under line */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
          fill="url(#areaGradient)"
        />

        {/* Line */}
        <path d={pathData} stroke="#F5A623" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="3" fill="#F5A623" />
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.x}
            y={height - padding + 18}
            textAnchor="middle"
            className="text-[10px]"
            fill="white"
            opacity="0.6"
          >
            {p.month}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => (
          <text
            key={`ylabel-${i}`}
            x={padding - 8}
            y={height - padding - (i * graphHeight) / 4 + 4}
            textAnchor="end"
            className="text-[9px]"
            fill="white"
            opacity="0.5"
          >
            {Math.round((i / 4) * maxGoals)}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#F5A623]" />
        <span className="text-white/50 text-xs">Goles por mes</span>
      </div>
    </div>
  );
}
