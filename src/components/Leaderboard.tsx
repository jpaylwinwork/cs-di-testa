'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Player, Goal, GoalType, Match } from '@/data/types';
import { PlayerModal } from './PlayerModal';

type SortKey = 'goals' | 'assists';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'goals',   label: 'Goles' },
  { key: 'assists', label: 'Asist' },
];

const POS_COLORS: Record<string, string> = {
  POR: 'bg-amber-400/15 text-amber-300',
  DEF: 'bg-emerald-500/15 text-emerald-300',
  MED: 'bg-sky-500/15 text-sky-300',
  DEL: 'bg-rose-500/15 text-rose-300',
};

const GOAL_TYPE_STYLES: Record<GoalType, { label: string; color: string }> = {
  'Ataque rapido':    { label: '⚡', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  'Balon parado':     { label: '🎯', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30'       },
  'Ataque organizado':{ label: '🔄', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  'Recuperacion':     { label: '↩️', color: 'bg-green-500/20 text-green-300 border-green-500/30'    },
  'Penal':            { label: 'P',  color: 'bg-red-500/20 text-red-300 border-red-500/30'          },
};

interface Props {
  players: Player[];
  goals: Goal[];
  matches?: Match[];
}

export default function Leaderboard({ players, goals, matches = [] }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('goals');
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Only show players with goals or assists
  const filtered = players.filter(p => p.goals > 0 || p.assists > 0);

  const sorted = [...filtered].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDesc ? -diff : diff;
  });

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  function getGoalTypes(name: string): Partial<Record<GoalType, number>> {
    const counts: Partial<Record<GoalType, number>> = {};
    goals.filter(g => g.scorer === name).forEach(g => {
      counts[g.type] = (counts[g.type] || 0) + 1;
    });
    return counts;
  }

  return (
    <div className="space-y-3">
      {/* Goal type legend */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 px-1">
        <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold w-full sm:w-auto">Tipos de gol:</span>
        {(Object.entries(GOAL_TYPE_STYLES) as [GoalType, { label: string; color: string }][]).map(([type, style]) => (
          <span key={type} className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold border ${style.color}`}>
            {style.label} <span className="font-normal opacity-80 hidden sm:inline">{type === 'Ataque rapido' ? 'Ataque rápido' : type === 'Balon parado' ? 'Balón parado' : type === 'Ataque organizado' ? 'Organizado' : type === 'Recuperacion' ? 'Recuperación' : 'Penal'}</span>
          </span>
        ))}
      </div>

    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#11296B]/80 border-b border-white/10">
            <th className="px-2 sm:px-4 py-2.5 sm:py-3 text-left text-white/40 text-[10px] sm:text-xs uppercase tracking-wider font-semibold w-8 sm:w-10">#</th>
            <th className="px-2 sm:px-4 py-2.5 sm:py-3 text-left text-white/40 text-[10px] sm:text-xs uppercase tracking-wider font-semibold flex-1">Jugador</th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="px-2 sm:px-4 py-2.5 sm:py-3 text-center text-[10px] sm:text-xs uppercase tracking-wider font-semibold cursor-pointer select-none group w-14 sm:w-24"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className={sortKey === col.key ? 'text-[#F5A623]' : 'text-white/40 group-hover:text-white/70 transition-colors'}>
                    {col.label}
                  </span>
                  {sortKey === col.key ? (
                    sortDesc ? <ChevronDown size={12} className="text-[#F5A623]" /> : <ChevronUp size={12} className="text-[#F5A623]" />
                  ) : (
                    <ChevronDown size={12} className="text-white/20 group-hover:text-white/40 transition-colors" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, i) => {
            const isFirst = i === 0;
            const goalTypes = getGoalTypes(player.name);
            const hasTypes = Object.keys(goalTypes).length > 0;

            return (
              <tr
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className={`
                  border-b border-white/5 transition-colors duration-100
                  hover:bg-[#1a3a8f]/40 cursor-pointer
                  ${isFirst ? 'bg-[#F5A623]/5' : i % 2 === 0 ? 'bg-[#11296B]/30' : 'bg-transparent'}
                `}
              >
                <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-center">
                  <span className={`font-bold text-xs sm:text-sm ${isFirst ? 'text-[#F5A623]' : 'text-white/40'}`}>
                    {isFirst ? '🥇' : i + 1}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2.5 sm:py-3">
                  <div className="flex flex-col gap-1">
                    <span className={`font-semibold text-sm sm:text-base ${isFirst ? 'text-white' : 'text-white/85'}`}>
                      {player.name.split(' ')[0]}
                      <span className="hidden sm:inline"> {player.name.split(' ').slice(1).join(' ')}</span>
                    </span>
                    {hasTypes && (
                      <div className="flex flex-wrap gap-1">
                        {(Object.entries(goalTypes) as [GoalType, number][]).map(([type, count]) => {
                          const style = GOAL_TYPE_STYLES[type];
                          return (
                            <span key={type} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border ${style.color}`}>
                              {style.label} {count}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </td>
                {COLUMNS.map((col) => (
                  <td key={col.key} className="px-2 sm:px-4 py-2.5 sm:py-3 text-center">
                    <span className={`font-bold text-base sm:text-lg ${col.key === 'goals' ? 'text-[#F5A623]' : 'text-white'}`}>
                      {player[col.key]}
                    </span>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    {selectedPlayer && (
      <PlayerModal
        player={selectedPlayer}
        matches={matches}
        goals={goals}
        totalMatches={matches.length}
        onClose={() => setSelectedPlayer(null)}
      />
    )}
    </div>
  );
}
