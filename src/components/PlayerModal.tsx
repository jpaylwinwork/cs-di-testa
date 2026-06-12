'use client';

import { Player, Match, Goal, MatchType } from '@/data/types';

const TYPE_BADGE: Record<MatchType, string> = {
  Liga:     'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Copa:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Amistoso: 'bg-white/10 text-white/50 border-white/20',
};

export function PlayerModal({ player, matches, goals, totalMatches, onClose }: {
  player: Player;
  matches: Match[];
  goals: Goal[];
  totalMatches: number;
  onClose: () => void;
}) {
  const attended = matches.filter(m =>
    m.lineup.includes(player.name) || m.bench.includes(player.name)
  );
  const pct = Math.round((player.appearances / totalMatches) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full sm:max-w-lg max-h-[90vh] sm:max-h-none bg-[#0A1A3E] border border-white/15 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-4 sm:px-5 py-4 border-b border-white/10 bg-[#11296B]/50">
          <div className="flex items-start justify-between gap-3 mb-3 sm:mb-0">
            <div className="min-w-0">
              <h3 className="text-white font-black text-base sm:text-lg truncate">{player.name}</h3>
              <p className="text-white/50 text-xs uppercase tracking-widest">{player.specificPosition}</p>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none cursor-pointer flex-shrink-0 p-1">✕</button>
          </div>
          <div className="grid grid-cols-5 gap-1 sm:flex sm:items-start sm:gap-3">
            {[
              { label: 'Goles',  value: player.goals,       color: 'text-[#F5A623]' },
              { label: 'Asist',  value: player.assists,     color: 'text-white'     },
              { label: 'Titular',value: player.starts,      color: 'text-white'     },
              { label: 'PJ',     value: player.appearances, color: 'text-sky-300'   },
              { label: 'Asist %',value: `${pct}%`,          color: 'text-emerald-300'},
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`font-black text-base sm:text-lg ${s.color}`}>{s.value}</div>
                <div className="text-white/40 text-[8px] sm:text-[9px] uppercase tracking-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Match table */}
        <div className="overflow-y-auto flex-1 min-h-0 max-h-[50vh] sm:max-h-80">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#11296B]/30">
                <th className="px-2 sm:px-4 py-2 text-left text-white/40 text-[10px] uppercase tracking-wider">Partido</th>
                <th className="px-2 sm:px-4 py-2 text-left text-white/40 text-[10px] uppercase tracking-wider">Rival</th>
                <th className="px-2 sm:px-4 py-2 text-center text-white/40 text-[10px] uppercase tracking-wider">Rol</th>
                <th className="px-2 sm:px-4 py-2 text-center text-white/40 text-[10px] uppercase tracking-wider">⚽</th>
              </tr>
            </thead>
            <tbody>
              {attended.map(m => {
                const isTitular = m.lineup.includes(player.name);
                const matchGoals = goals.filter(g => g.matchId === m.id && g.scorer === player.name).length;
                return (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-[#11296B]/20">
                    <td className="px-2 sm:px-4 py-2.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TYPE_BADGE[m.type]}`}>
                        {m.type === 'Liga' ? `J${m.id}` : m.id}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 text-white/80 text-xs max-w-[80px] sm:max-w-none truncate">{m.rival}</td>
                    <td className="px-2 sm:px-4 py-2.5 text-center">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isTitular ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/40'}`}>
                        {isTitular ? 'Tit.' : 'Sup.'}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 text-center">
                      {matchGoals > 0
                        ? <span className="text-[#F5A623] font-bold">{matchGoals} ⚽</span>
                        : <span className="text-white/20">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/10 text-white/30 text-[11px]">
          Haz clic fuera para cerrar · {player.appearances} de {totalMatches} partidos asistidos
        </div>
      </div>
    </div>
  );
}
