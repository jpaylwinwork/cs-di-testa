'use client';

import { Player, Match, Goal, MatchType } from '@/data/types';

const TYPE_BADGE: Record<MatchType, string> = {
  Liga:     'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Copa:     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Amistoso: 'bg-white/10 text-white/50 border-white/20',
};

export function MatchModal({ match, players, goals, onClose }: {
  match: Match;
  players: Player[];
  goals: Goal[];
  onClose: () => void;
}) {
  const playerMap = new Map(players.map(p => [p.name, p]));
  const lineup = match.lineup.map(n => playerMap.get(n)!).filter(Boolean);
  const bench = match.bench.map(n => playerMap.get(n)!).filter(Boolean);
  const matchGoals = goals.filter(g => g.matchId === match.id);
  const scorers = matchGoals.map(g => g.scorer);
  let uniqueScorers = [...new Set(scorers)].filter(s => s !== 'Autogol');

  // Calculate missing goals and add autogol if needed
  const playerGoalCount = uniqueScorers.length > 0
    ? uniqueScorers.reduce((sum, scorer) => sum + scorers.filter(s => s === scorer).length, 0)
    : 0;
  const missingGoals = match.goalsFor - playerGoalCount;

  if (missingGoals > 0) {
    uniqueScorers = [...uniqueScorers, 'Autogol'];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full sm:max-w-2xl max-h-[90vh] sm:max-h-none bg-[#0A1A3E] border border-white/15 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header with match info */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#11296B]/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${TYPE_BADGE[match.type]}`}>
                {match.type === 'Liga' ? `J${match.id}` : match.id}
              </span>
              {match.date !== '?' && (
                <span className="text-white/40 text-xs">{match.date}</span>
              )}
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white text-xl cursor-pointer">✕</button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-center flex-1">
              <p className="text-white font-semibold text-sm mb-1">CS Di Testa</p>
              <div className="text-white font-black text-3xl text-center">{match.goalsFor}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-white/40 text-xs uppercase tracking-wider font-semibold">Resultado</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                match.outcome === 'V' ? 'bg-emerald-500/20 text-emerald-300' :
                match.outcome === 'E' ? 'bg-white/10 text-white/50' :
                'bg-red-500/20 text-red-300'
              }`}>
                {match.outcome === 'V' ? 'Victoria' : match.outcome === 'E' ? 'Empate' : 'Derrota'}
              </span>
            </div>
            <div className="text-center flex-1">
              <p className="text-white font-semibold text-sm mb-1">{match.rival}</p>
              <div className="text-white font-black text-3xl text-center">{match.goalsAgainst}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 min-h-0 max-h-[50vh] sm:max-h-96 px-4 sm:px-5 py-4 space-y-4">
          {/* Scorers */}
          {uniqueScorers.length > 0 && (
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Goleadores</p>
              <div className="space-y-1.5">
                {uniqueScorers.map(scorer => {
                  const count = scorer === 'Autogol' ? missingGoals : scorers.filter(s => s === scorer).length;
                  return (
                    <div key={scorer} className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      scorer === 'Autogol'
                        ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-[#11296B]/30'
                    }`}>
                      <span className={`text-sm ${scorer === 'Autogol' ? 'text-red-400' : 'text-white/90'}`}>
                        {scorer === 'Autogol' ? 'Autogol (Equipo Rival)' : scorer}
                      </span>
                      <span className={`font-bold ${scorer === 'Autogol' ? 'text-red-400' : 'text-[#F5A623]'}`}>
                        {count} ⚽
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Starting XI */}
          {lineup.length > 0 && (
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Once Titular ({lineup.length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lineup.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <span className="text-white/90 text-sm truncate mr-2">{p.name}</span>
                    <span className="text-white/40 text-xs">{p.specificPosition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bench */}
          {bench.length > 0 && (
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Suplentes ({bench.length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bench.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/70 text-sm truncate mr-2">{p.name}</span>
                    <span className="text-white/30 text-xs">{p.specificPosition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 text-white/30 text-[11px]">
          Haz clic fuera para cerrar
        </div>
      </div>
    </div>
  );
}
