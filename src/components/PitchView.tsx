'use client';

import { useState, useMemo } from 'react';
import { Player, Match, Goal, SpecificPosition } from '@/data/types';
import JerseyToken from './JerseyToken';
import { PlayerModal } from './PlayerModal';

// ── Formation slots (left %, top %) ─────────────────────────────────────────

const SLOTS: { left: string; top: string }[] = [
  { left: '50%', top: '85%' }, // 0  GK
  { left: '14%', top: '65%' }, // 1  LB
  { left: '35%', top: '63%' }, // 2  CB-L
  { left: '65%', top: '63%' }, // 3  CB-R
  { left: '86%', top: '65%' }, // 4  RB
  { left: '22%', top: '42%' }, // 5  CM-L
  { left: '50%', top: '40%' }, // 6  CM-C
  { left: '78%', top: '42%' }, // 7  CM-R
  { left: '14%', top: '18%' }, // 8  LW
  { left: '50%', top: '15%' }, // 9  ST
  { left: '86%', top: '18%' }, // 10 RW
];

function mapToSlots(names: string[], playerMap: Map<string, Player>): (Player | null)[] {
  const slots: (Player | null)[] = Array(11).fill(null);
  const players = names.map(n => playerMap.get(n)).filter(Boolean) as Player[];
  const pick = (pos: SpecificPosition[]) =>
    players.filter(p => pos.includes(p.specificPosition)).sort((a, b) => b.starts - a.starts);

  const gks = pick(['A']), lis = pick(['LI']), lds = pick(['LD']);
  const cds = pick(['CD', 'CI']), mccs = pick(['MCC', 'MCO']), exts = pick(['EXT', 'EI', 'ED']);
  const dcs = pick(['DC']);

  slots[0] = gks[0] || null;
  slots[1] = lis[0] || cds.at(-1) || null;
  slots[2] = cds[0] || null;
  slots[3] = cds[1] || null;
  slots[4] = lds[0] || null;
  slots[5] = mccs[0] || exts.at(-1) || null;
  slots[6] = mccs[1] || exts.at(-2) || null;
  slots[7] = mccs[2] || exts.at(-3) || null;
  slots[8] = exts[0] || dcs.at(-1) || null;
  slots[9] = dcs[0] || null;
  slots[10] = exts[1] || exts[0] || null;

  const usedIds = new Set(slots.filter(Boolean).map(p => p!.id));
  const unused = players.filter(p => !usedIds.has(p.id));
  slots.forEach((s, i) => { if (!s && unused.length) slots[i] = unused.shift()!; });
  return slots;
}

function getBestXI(players: Player[]): string[] {
  const byStarts = (a: Player, b: Player) => b.starts - a.starts;
  const gk   = players.filter(p => p.position === 'POR').sort(byStarts).slice(0, 1);
  const defs = players.filter(p => p.position === 'DEF').sort(byStarts).slice(0, 4);
  const mccs = players.filter(p => p.position === 'MED' && ['MCC','MCO'].includes(p.specificPosition))
    .sort(byStarts).slice(0, 3);
  // Wingers can be DEL or MED with specificPosition EXT/EI/ED
  const exts = players.filter(p => ['EXT','EI','ED'].includes(p.specificPosition))
    .sort(byStarts).slice(0, 2);
  // Striker: best DC not already picked as EXT
  const extNames = new Set(exts.map(p => p.name));
  const dcs  = players.filter(p => p.specificPosition === 'DC' && !extNames.has(p.name))
    .sort(byStarts).slice(0, 1);
  return [...gk, ...defs, ...mccs, ...exts, ...dcs].map(p => p.name);
}

// ── Badge styles ─────────────────────────────────────────────────────────────

const TYPE_BADGE: Record<string, string> = {
  Liga:     'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Copa:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Amistoso: 'bg-white/10 text-white/50 border-white/20',
};

const OUTCOME_STYLE: Record<string, string> = {
  V: 'bg-emerald-500/20 text-emerald-300',
  E: 'bg-white/10 text-white/50',
  D: 'bg-red-500/20 text-red-300',
};

// ── Main component ────────────────────────────────────────────────────────────

interface Props { players: Player[]; matches: Match[]; goals: Goal[] }

export default function PitchView({ players, matches, goals }: Props) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer]   = useState<Player | null>(null);

  const playerMap  = useMemo(() => new Map(players.map(p => [p.name, p])), [players]);
  const activeMatch = matches.find(m => m.id === selectedMatchId);

  const activeLineup = useMemo(() =>
    selectedMatchId ? (activeMatch?.lineup ?? getBestXI(players)) : getBestXI(players),
    [selectedMatchId, activeMatch, players]
  );
  const activeBench = useMemo(() =>
    selectedMatchId ? (activeMatch?.bench ?? []) : [],
    [selectedMatchId, activeMatch]
  );
  const slots = useMemo(() => mapToSlots(activeLineup, playerMap), [activeLineup, playerMap]);

  const matchGoals = useMemo(() =>
    selectedMatchId ? goals.filter(g => g.matchId === selectedMatchId) : goals,
    [selectedMatchId, goals]
  );

  function getGoalsForPlayer(name: string) {
    if (selectedMatchId) return matchGoals.filter(g => g.scorer === name).length;
    return playerMap.get(name)?.goals ?? 0;
  }

  return (
    <>
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer} matches={matches} goals={goals}
          totalMatches={matches.length} onClose={() => setSelectedPlayer(null)}
        />
      )}

      <div className="space-y-4">
        {/* Match selector */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedMatchId(null)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMatchId === null ? 'border-[#F5A623] bg-[#F5A623]/10' : 'border-white/10 bg-[#11296B]/30 hover:border-white/30'
              }`}
            >
              <div className="text-xs font-bold text-[#F5A623] uppercase tracking-wider">⭐ Mejor 11</div>
              <div className="text-white/50 text-[10px] mt-0.5">Temporada completa</div>
            </button>
            {matches.map(m => (
              <button key={m.id} onClick={() => setSelectedMatchId(m.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedMatchId === m.id ? 'border-[#F5A623] bg-[#F5A623]/10' : 'border-white/10 bg-[#11296B]/30 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TYPE_BADGE[m.type]}`}>
                    {m.type === 'Liga' ? `J${m.id}` : m.id}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${OUTCOME_STYLE[m.outcome]}`}>{m.outcome}</span>
                </div>
                <div className="text-white/80 text-xs font-semibold">vs {m.rival}</div>
                <div className="text-white/40 text-[10px]">{m.goalsFor}–{m.goalsAgainst}{m.date !== '?' ? ` · ${m.date}` : ''}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Info bar */}
        <div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border ${activeMatch ? 'bg-[#11296B]/40 border-white/10' : 'bg-[#F5A623]/10 border-[#F5A623]/30'}`}>
          {activeMatch ? (
            <>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border flex-shrink-0 ${TYPE_BADGE[activeMatch.type]}`}>{activeMatch.type}</span>
                {activeMatch.date !== '?' && (
                  <span className="text-white/40 text-xs sm:hidden">{activeMatch.date}</span>
                )}
              </div>
              <span className="text-white font-semibold text-xs sm:text-sm leading-snug">
                CS Di Testa {activeMatch.goalsFor} — {activeMatch.goalsAgainst} {activeMatch.rival}
              </span>
              <span className="text-white/40 text-xs sm:ml-auto hidden sm:block">{activeMatch.date !== '?' ? activeMatch.date : ''}</span>
            </>
          ) : (
            <>
              <span className="text-[#F5A623] font-bold text-xs sm:text-sm">⭐ Mejor 11 de la Temporada</span>
              <span className="text-white/40 text-[10px] sm:text-xs sm:ml-auto">Haz clic en un jugador para ver su historial</span>
            </>
          )}
        </div>

        {/* Pitch — taller aspect ratio on mobile to avoid player overlaps */}
        <div
          className="relative w-full rounded-2xl overflow-hidden pb-[90%] sm:pb-[75%] lg:pb-[65%]"
          style={{ background: '#1a4731' }}
        >

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 65" preserveAspectRatio="none">
            <rect x="2" y="2" width="96" height="61" fill="none" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" />
            <line x1="2" y1="32.5" x2="98" y2="32.5" stroke="white" strokeWidth="0.3" strokeOpacity="0.2" />
            <circle cx="50" cy="32.5" r="8" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.2" />
            <circle cx="50" cy="32.5" r="0.6" fill="white" fillOpacity="0.3" />
            <rect x="28" y="2" width="44" height="14" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.2" />
            <rect x="37" y="2" width="26" height="6" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.15" />
            <rect x="28" y="49" width="44" height="14" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.2" />
            <rect x="37" y="57" width="26" height="6" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.15" />
            {[0,1,2,3,4,5,6,7,8,9].map(i => (
              <rect key={i} x="2" y={2 + i * 6.1} width="96" height="3.05" fill="white" fillOpacity={i % 2 === 0 ? 0.015 : 0} />
            ))}
          </svg>

          {slots.map((player, i) => {
            const slot = SLOTS[i];
            const playerGoals = player ? getGoalsForPlayer(player.name) : 0;
            return (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 cursor-pointer group"
                style={{ left: slot.left, top: slot.top }}
                onClick={() => player && setSelectedPlayer(player)}
              >
                <div className="scale-75 sm:scale-100 transition-transform duration-150 group-hover:scale-90 sm:group-hover:scale-110 origin-bottom">
                  <JerseyToken size={48} />
                </div>
                <div className="bg-[#0A1A3E]/90 rounded px-1 py-0.5 text-center w-14 sm:w-auto sm:max-w-[96px] group-hover:bg-[#11296B]/90 transition-colors">
                  <span className="text-white text-[9px] sm:text-[11px] font-bold leading-tight block truncate">
                    {player ? player.name.split(' ')[0] : '—'}
                  </span>
                  {player && playerGoals > 0 && (
                    <span className="text-[#F5A623] text-[8px] sm:text-[10px] font-bold leading-none">{playerGoals}⚽</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bench */}
        {activeBench.length > 0 && (
          <div className="bg-[#11296B]/30 rounded-xl border border-white/10 px-4 py-3">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3">Banca ({activeBench.length} jugadores)</p>
            <div className="flex flex-wrap gap-3">
              {activeBench.map(name => {
                const p = playerMap.get(name);
                if (!p) return null;
                const benchGoals = matchGoals.filter(g => g.scorer === name).length;
                return (
                  <button key={name} onClick={() => setSelectedPlayer(p)}
                    className="flex flex-col items-center gap-0.5 cursor-pointer group"
                  >
                    <div className="transition-transform duration-150 group-hover:scale-105">
                      <JerseyToken size={36} />
                    </div>
                    <div className="bg-[#0A1A3E]/80 rounded px-1.5 py-0.5 text-center max-w-[72px]">
                      <span className="text-white/80 text-[10px] font-semibold truncate block">{name.split(' ')[0]}</span>
                      {benchGoals > 0 && <span className="text-[#F5A623] text-[9px] font-bold">{benchGoals}⚽</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-white/30 text-xs text-center">
          Formación 4-3-3 · Haz clic en un jugador para ver su historial
        </p>
      </div>
    </>
  );
}
