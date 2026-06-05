'use client';

import { useState } from 'react';
import { Player, PositionGroup, Match, Goal } from '@/data/types';
import PlayerCard from './PlayerCard';
import { PlayerModal } from './PlayerModal';

const POSITION_META: Record<PositionGroup, { label: string; color: string }> = {
  POR: { label: 'Arqueros',        color: 'bg-amber-400/20 text-amber-300 border-amber-400/30'     },
  DEF: { label: 'Defensas',        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  MED: { label: 'Mediocampistas',  color: 'bg-sky-500/20 text-sky-300 border-sky-500/30'           },
  DEL: { label: 'Delanteros',      color: 'bg-rose-500/20 text-rose-300 border-rose-500/30'        },
};

const POSITIONS: PositionGroup[] = ['POR', 'DEF', 'MED', 'DEL'];

interface Props {
  players: Player[];
  matches?: Match[];
  goals?: Goal[];
}

export default function PositionView({ players, matches = [], goals = [] }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <div className="space-y-8">
      {POSITIONS.map((pos) => {
        const group = players
          .filter((p) => p.position === pos)
          .sort((a, b) => b.goals - a.goals || b.assists - a.assists);

        if (group.length === 0) return null;

        const meta = POSITION_META[pos];

        return (
          <section key={pos}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${meta.color}`}>
                {pos}
              </span>
              <h2 className="text-white/70 text-sm font-semibold uppercase tracking-widest">
                {meta.label}
              </h2>
              <span className="text-white/30 text-xs">({group.length})</span>
            </div>

            <div className="hidden lg:grid grid-cols-[1fr_repeat(4,3rem)] gap-x-6 px-4 mb-1">
              <span className="text-white/30 text-[10px] uppercase tracking-wider">Jugador</span>
              {['Goles', 'Asist', 'PJ', 'Titular'].map((h) => (
                <span key={h} className="text-white/30 text-[10px] uppercase tracking-wider text-center">{h}</span>
              ))}
            </div>

            {/* Mobile header */}
            <div className="block lg:hidden px-4 mb-2 text-[9px] text-white/40 uppercase tracking-wider">
              G=Goles · A=Asist · PJ=Partidos · T=Titular
            </div>

            <div className="space-y-2">
              {group.map((player, i) => (
                <div key={player.id} className="block lg:hidden space-y-1">
                  {/* Mobile: Stacked layout */}
                  <div
                    onClick={() => setSelectedPlayer(player)}
                    className="px-4 py-3 rounded-lg bg-[#11296B]/60 hover:bg-[#1a3a8f]/60 transition-colors cursor-pointer border border-white/8"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white/90">
                        {player.name}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#F5A623] font-black text-lg">{player.goals}</span>
                        <span className="text-[#F5A623] text-xs">G</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center text-[10px]">
                      <div><div className="font-bold text-white text-xs">{player.assists}</div><div className="text-white/40">A</div></div>
                      <div><div className="font-bold text-sky-300 text-xs">{player.appearances}</div><div className="text-white/40">PJ</div></div>
                      <div><div className="font-bold text-white text-xs">{player.starts}</div><div className="text-white/40">T</div></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Desktop: Card layout */}
              <div className="hidden lg:space-y-2 lg:block">
                {group.map((player, i) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isTop={i === 0}
                    onClick={() => setSelectedPlayer(player)}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

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
