'use client';

import { useState } from 'react';
import { Match, Goal, Player } from '@/data/types';
import { MatchModal } from './MatchModal';

const TYPE_BADGE: Record<string, string> = {
  Liga:     'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Copa:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Amistoso: 'bg-white/10 text-white/50 border-white/20',
};

const OUTCOME_STYLE: Record<string, { bar: string; badge: string; label: string }> = {
  V: { bar: 'border-l-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300', label: 'Victoria' },
  E: { bar: 'border-l-white/30',    badge: 'bg-white/10 text-white/50',          label: 'Empate'   },
  D: { bar: 'border-l-red-500',     badge: 'bg-red-500/20 text-red-300',         label: 'Derrota'  },
};

interface Props {
  matches: Match[];
  goals: Goal[];
  players?: Player[];
}

export default function FixtureView({ matches, goals, players = [] }: Props) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const played  = matches.filter(m => m.rival !== '?');
  const pending = matches.filter(m => m.rival === '?');

  const getMatchGoals = (matchId: string) =>
    goals.filter(g => g.matchId === matchId);

  const totals = {
    wins:   played.filter(m => m.outcome === 'V').length,
    draws:  played.filter(m => m.outcome === 'E').length,
    losses: played.filter(m => m.outcome === 'D').length,
    gf:     played.reduce((s, m) => s + m.goalsFor, 0),
    ga:     played.reduce((s, m) => s + m.goalsAgainst, 0),
  };

  return (
    <div className="space-y-6">
      {/* Season summary strip */}
      <div className="grid grid-cols-5 gap-2 text-center">
        {[
          { label: 'PJ', value: played.length,             color: 'text-white'        },
          { label: 'V',  value: totals.wins,               color: 'text-emerald-400'  },
          { label: 'E',  value: totals.draws,              color: 'text-white/50'     },
          { label: 'D',  value: totals.losses,             color: 'text-red-400'      },
          { label: 'GD', value: `${totals.gf}:${totals.ga}`, color: 'text-[#F5A623]' },
        ].map(s => (
          <div key={s.label} className="bg-[#11296B]/40 rounded-xl py-3 border border-white/10">
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Match list */}
      <div className="space-y-2">
        {played.map((match) => {
          const out = OUTCOME_STYLE[match.outcome];
          const matchGoals = getMatchGoals(match.id);
          const scorers = matchGoals.map(g => g.scorer).filter(s => s !== 'Autogol');
          const uniqueScorers = [...new Set(scorers)];

          return (
            <div
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className={`px-4 py-3 rounded-xl bg-[#11296B]/40 border border-white/10 border-l-4 ${out.bar} cursor-pointer hover:bg-[#1a3a8f]/40 transition-colors`}
            >
              {/*
                3-column grid with EQUAL outer widths so the score is always
                perfectly centered regardless of team name length.
                w-36 (144px) for both sides on ≥sm; stack on mobile.
              */}
              <div className="flex flex-col sm:grid sm:grid-cols-[144px_1fr_144px] sm:items-center gap-2">

                {/* Left — badge + date */}
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${TYPE_BADGE[match.type]}`}>
                    {match.type === 'Liga' ? `J${match.id}` : match.id}
                  </span>
                  {match.date !== '?' && (
                    <span className="text-white/40 text-xs">{match.date}</span>
                  )}
                </div>

                {/* Center — score: left-team | numbers | right-team */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
                  <span className="text-white font-semibold text-sm text-right truncate pr-1">CS Di Testa</span>
                  <span className="text-white font-black text-xl tabular-nums whitespace-nowrap px-3">
                    {match.goalsFor} — {match.goalsAgainst}
                  </span>
                  <span className="text-white font-semibold text-sm text-left truncate pl-1">{match.rival}</span>
                </div>

                {/* Right — outcome badge */}
                <div className="sm:flex sm:justify-end">
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg ${out.badge}`}>
                    {out.label}
                  </span>
                </div>
              </div>

              {/* Scorers row */}
              {scorers.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                  <span className="text-white/30 text-[10px]">⚽</span>
                  {uniqueScorers.map(scorer => {
                    const count = scorers.filter(s => s === scorer).length;
                    return (
                      <span key={scorer} className="text-white/60 text-[11px]">
                        {scorer.split(' ')[0]}{count > 1 ? ` ×${count}` : ''}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pending.length > 0 && (
        <div className="border-t border-white/10 pt-4 space-y-2">
          <p className="text-white/30 text-xs uppercase tracking-wider">Próximos partidos</p>
          {pending.map(m => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/15">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${TYPE_BADGE[m.type]}`}>
                {m.type === 'Liga' ? `J${m.id}` : m.id}
              </span>
              <span className="text-white/40 text-sm">Por jugarse</span>
            </div>
          ))}
        </div>
      )}

      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          players={players}
          goals={goals}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
