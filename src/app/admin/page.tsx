'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Player, Match, Goal, MatchType, Outcome, GoalType, SpecificPosition, PositionGroup } from '@/data/types';

// ── Styles ────────────────────────────────────────────────────────────────────
const INPUT  = 'bg-[#0A1A3E] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-[#F5A623] outline-none transition-colors w-full';
const SELECT = `${INPUT} cursor-pointer`;

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

// ── Utilities ─────────────────────────────────────────────────────────────────
function autoOutcome(gf: number, ga: number): Outcome {
  return gf > ga ? 'V' : gf < ga ? 'D' : 'E';
}

function parseDateMs(d: string): number {
  if (d === '?') return Infinity;
  const [dd, mm, yyyy] = d.split('/').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

function posGroupFromSpec(sp: SpecificPosition): PositionGroup {
  if (sp === 'A') return 'POR';
  if (['CD','CI','LD','LI'].includes(sp)) return 'DEF';
  if (['MCC','MCO','EXT','ED','EI'].includes(sp)) return 'MED';
  return 'DEL';
}

const SPECIFIC_POSITIONS: { value: SpecificPosition; label: string }[] = [
  { value: 'A',   label: 'A — Arquero'               },
  { value: 'CD',  label: 'CD — Central Derecho'       },
  { value: 'CI',  label: 'CI — Central Izquierdo'     },
  { value: 'LD',  label: 'LD — Lateral Derecho'       },
  { value: 'LI',  label: 'LI — Lateral Izquierdo'     },
  { value: 'MCC', label: 'MCC — Mediocampista Central'},
  { value: 'MCO', label: 'MCO — Mediocampista Ofensivo'},
  { value: 'EXT', label: 'EXT — Extremo'              },
  { value: 'ED',  label: 'ED — Extremo Derecho'       },
  { value: 'EI',  label: 'EI — Extremo Izquierdo'     },
  { value: 'DC',  label: 'DC — Delantero Centro'      },
];

// ── Add Player inline form ────────────────────────────────────────────────────
function AddPlayerForm({ existingIds, onAdd }: {
  existingIds: number[];
  onAdd: (player: Player) => void;
}) {
  const [open,  setOpen]  = useState(false);
  const [name,  setName]  = useState('');
  const [spec,  setSpec]  = useState<SpecificPosition>('EXT');

  function handleAdd() {
    if (!name.trim()) return;
    const maxId = existingIds.length ? Math.max(...existingIds) : 0;
    const newPlayer: Player = {
      id: maxId + 1,
      name: name.trim(),
      specificPosition: spec,
      position: posGroupFromSpec(spec),
      goals: 0, assists: 0, appearances: 0, starts: 0,
    };
    onAdd(newPlayer);
    setName('');
    setSpec('EXT');
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left text-[#F5A623]/70 hover:text-[#F5A623] text-xs font-semibold px-3 py-2 border border-dashed border-[#F5A623]/20 hover:border-[#F5A623]/50 rounded-lg transition-colors cursor-pointer"
      >
        ＋ Agregar nuevo jugador
      </button>
    );
  }

  return (
    <div className="bg-[#0A1A3E]/70 border border-[#F5A623]/30 rounded-lg p-3 space-y-3">
      <p className="text-[#F5A623] text-xs font-bold uppercase tracking-wider">Nuevo jugador</p>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
        <div>
          <label className="text-white/40 text-[10px] block mb-1">Nombre completo *</label>
          <input
            className={INPUT}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Juan Pérez"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
        </div>
        <div className="min-w-[200px]">
          <label className="text-white/40 text-[10px] block mb-1">Posición *</label>
          <select className={SELECT} value={spec} onChange={e => setSpec(e.target.value as SpecificPosition)}>
            {SPECIFIC_POSITIONS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="bg-[#F5A623] hover:bg-[#d4911e] text-[#0A1A3E] font-black px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            Agregar
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-white/40 hover:text-white px-3 py-2 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>
      <p className="text-white/30 text-[10px]">
        El jugador quedará disponible en todos los partidos. Podrás marcar sus estadísticas en cada uno.
      </p>
    </div>
  );
}

// ── Player stats table (shared between MatchCard and AddMatchModal) ────────────
type PlayerStat = { p: boolean; t: boolean; g: number; a: number };

function PlayerStatsTable({ players, stats, onChange }: {
  players: Player[];
  stats: Record<string, PlayerStat>;
  onChange: (name: string, field: keyof PlayerStat, value: boolean | number) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="border-b border-white/10 bg-[#0A1A3E]/60">
            <th className="px-3 py-2 text-left text-white/40 text-[10px] uppercase tracking-wider">Jugador</th>
            <th className="px-3 py-2 text-center text-white/40 text-[10px] uppercase w-12">P</th>
            <th className="px-3 py-2 text-center text-white/40 text-[10px] uppercase w-12">T</th>
            <th className="px-3 py-2 text-center text-white/40 text-[10px] uppercase w-16">G</th>
            <th className="px-3 py-2 text-center text-white/40 text-[10px] uppercase w-16">A</th>
          </tr>
        </thead>
        <tbody>
          {players.map((pl, i) => {
            const s = stats[pl.name] ?? { p: false, t: false, g: 0, a: 0 };
            const numInput = 'bg-[#0A1A3E] border border-white/15 rounded px-2 py-1 text-white text-xs text-center w-full focus:border-[#F5A623] outline-none';
            return (
              <tr key={pl.id} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-[#11296B]/20' : ''}`}>
                <td className="px-3 py-2">
                  <span className="text-white/80 text-xs">{pl.name}</span>
                  <span className="text-white/30 text-[10px] ml-1.5">{pl.specificPosition}</span>
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="checkbox" checked={s.p}
                    onChange={e => onChange(pl.name, 'p', e.target.checked)}
                    className="w-4 h-4 accent-[#F5A623] cursor-pointer" />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="checkbox" checked={s.t} disabled={!s.p}
                    onChange={e => onChange(pl.name, 't', e.target.checked)}
                    className="w-4 h-4 accent-[#F5A623] cursor-pointer disabled:opacity-30" />
                </td>
                <td className="px-3 py-2">
                  <input type="number" min={0} max={20} value={s.g}
                    onChange={e => onChange(pl.name, 'g', +e.target.value)}
                    className={numInput} />
                </td>
                <td className="px-3 py-2">
                  <input type="number" min={0} max={20} value={s.a}
                    onChange={e => onChange(pl.name, 'a', +e.target.value)}
                    className={numInput} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Match Editor Card ─────────────────────────────────────────────────────────
function MatchCard({ match, players, goals, onSave, onDelete, onAddPlayer }: {
  match: Match; players: Player[]; goals: Goal[];
  onSave: (updated: Match, updatedGoals: Goal[]) => void;
  onDelete: () => void;
  onAddPlayer: (p: Player) => void;
}) {
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [rival,   setRival]   = useState(match.rival);
  const [date,    setDate]    = useState(match.date);
  const [matchId, setMatchId] = useState(match.id);
  const [type,    setType]    = useState<MatchType>(match.type);
  const [gf,      setGf]      = useState(match.goalsFor);
  const [ga,      setGa]      = useState(match.goalsAgainst);
  const [outcome, setOutcome] = useState<Outcome>(match.outcome);
  const [stats,   setStats]   = useState<Record<string, PlayerStat>>(() => {
    const s: Record<string, PlayerStat> = {};
    players.forEach(pl => {
      s[pl.name] = {
        p: match.lineup.includes(pl.name) || match.bench.includes(pl.name),
        t: match.lineup.includes(pl.name),
        g: goals.filter(g => g.matchId === match.id && g.scorer === pl.name).length,
        a: 0,
      };
    });
    return s;
  });

  // When a new player is added globally, add them to local stats
  useEffect(() => {
    setStats(prev => {
      const updated = { ...prev };
      players.forEach(pl => {
        if (!(pl.name in updated)) {
          updated[pl.name] = { p: false, t: false, g: 0, a: 0 };
        }
      });
      return updated;
    });
  }, [players]);

  function changeField(name: string, field: keyof PlayerStat, value: boolean | number) {
    setStats(prev => {
      const updated = { ...prev, [name]: { ...prev[name], [field]: value } };
      if (field === 'p' && !value) updated[name].t = false;
      if (field === 't' && value)  updated[name].p = true;
      return updated;
    });
  }

  async function handleSave() {
    setSaving(true);
    const lineup = players.filter(pl => stats[pl.name]?.t).map(pl => pl.name);
    const bench  = players.filter(pl => stats[pl.name]?.p && !stats[pl.name]?.t).map(pl => pl.name);
    const updatedMatch: Match = { ...match, id: matchId, rival, date, type, goalsFor: gf, goalsAgainst: ga, outcome, lineup, bench };
    const existingByMatch = goals.filter(g => g.matchId === match.id);
    const newGoals: Goal[] = [];
    players.forEach(pl => {
      for (let i = 0; i < (stats[pl.name]?.g ?? 0); i++) {
        const existing = existingByMatch.find(eg => eg.scorer === pl.name);
        newGoals.push({ matchId, date, rival, scorer: pl.name, type: (existing?.type ?? 'Ataque rapido') as GoalType });
      }
    });
    onSave(updatedMatch, [...goals.filter(g => g.matchId !== match.id), ...newGoals]);
    setSaving(false);
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar el partido ${match.id} vs ${match.rival}?\nEsta acción no se puede deshacer.`)) return;
    onDelete();
  }

  return (
    <div className="bg-[#11296B]/40 border border-white/10 rounded-xl overflow-hidden">
      {/* Collapsed header */}
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${TYPE_BADGE[match.type]}`}>
            {match.type === 'Liga' ? `J${match.id}` : match.id}
          </span>
          <span className="text-white font-semibold text-sm truncate">vs {match.rival}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${OUTCOME_STYLE[match.outcome]}`}>
            {match.goalsFor}–{match.goalsAgainst}
          </span>
          {match.date !== '?' && (
            <span className="text-white/40 text-xs hidden sm:block">{match.date}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDelete}
            title="Eliminar partido"
            className="text-red-500/50 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            className="text-white/50 hover:text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/15 hover:border-white/40 transition-colors cursor-pointer"
          >
            {open ? '▲ Cerrar' : '▼ Editar'}
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {open && (
        <div className="border-t border-white/10 px-4 py-4 space-y-5">
          {/* Match meta */}
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3">Datos del Partido</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-white/40 text-[10px] block mb-1">ID</label>
                <input className={INPUT} value={matchId} onChange={e => setMatchId(e.target.value)} />
              </div>
              <div>
                <label className="text-white/40 text-[10px] block mb-1">Tipo</label>
                <select className={SELECT} value={type} onChange={e => setType(e.target.value as MatchType)}>
                  <option value="Liga">Liga</option>
                  <option value="Copa">Copa</option>
                  <option value="Amistoso">Amistoso</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-white/40 text-[10px] block mb-1">Rival</label>
                <input className={INPUT} value={rival} onChange={e => setRival(e.target.value)} />
              </div>
              <div>
                <label className="text-white/40 text-[10px] block mb-1">Fecha</label>
                <input className={INPUT} value={date} onChange={e => setDate(e.target.value)} placeholder="DD/MM/YYYY" />
              </div>
              <div>
                <label className="text-white/40 text-[10px] block mb-1">Goles favor</label>
                <input type="number" min={0} className={INPUT} value={gf}
                  onChange={e => { const v = +e.target.value; setGf(v); setOutcome(autoOutcome(v, ga)); }} />
              </div>
              <div>
                <label className="text-white/40 text-[10px] block mb-1">Goles contra</label>
                <input type="number" min={0} className={INPUT} value={ga}
                  onChange={e => { const v = +e.target.value; setGa(v); setOutcome(autoOutcome(gf, v)); }} />
              </div>
              <div>
                <label className="text-white/40 text-[10px] block mb-1">Resultado</label>
                <select className={SELECT} value={outcome} onChange={e => setOutcome(e.target.value as Outcome)}>
                  <option value="V">Victoria (V)</option>
                  <option value="E">Empate (E)</option>
                  <option value="D">Derrota (D)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Player stats */}
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3">Estadísticas por Jugador</p>
            <PlayerStatsTable players={players} stats={stats} onChange={changeField} />
            <div className="mt-3">
              <AddPlayerForm
                existingIds={players.map(p => p.id)}
                onAdd={p => { onAddPlayer(p); }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#F5A623] hover:bg-[#d4911e] text-[#0A1A3E] font-black px-6 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-60 text-sm"
            >
              {saving ? 'Guardando…' : '💾 Guardar Cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Match Modal ───────────────────────────────────────────────────────────
function AddMatchModal({ players, onClose, onAdd, onAddPlayer }: {
  players: Player[];
  onClose: () => void;
  onAdd: (match: Match, goals: Goal[]) => void;
  onAddPlayer: (p: Player) => void;
}) {
  const [matchId,  setMatchId]  = useState('');
  const [type,     setType]     = useState<MatchType>('Liga');
  const [rival,    setRival]    = useState('');
  const [date,     setDate]     = useState('');
  const [gf,       setGf]       = useState(0);
  const [ga,       setGa]       = useState(0);
  const [outcome,  setOutcome]  = useState<Outcome>('V');
  const [stats,    setStats]    = useState<Record<string, PlayerStat>>(() => {
    const init: Record<string, PlayerStat> = {};
    players.forEach(pl => { init[pl.name] = { p: false, t: false, g: 0, a: 0 }; });
    return init;
  });
  const [saving,   setSaving]   = useState(false);

  // Sync new players added while modal is open
  useEffect(() => {
    setStats(prev => {
      const updated = { ...prev };
      players.forEach(pl => {
        if (!(pl.name in updated)) updated[pl.name] = { p: false, t: false, g: 0, a: 0 };
      });
      return updated;
    });
  }, [players]);

  function changeField(name: string, field: keyof PlayerStat, value: boolean | number) {
    setStats(prev => {
      const updated = { ...prev, [name]: { ...prev[name], [field]: value } };
      if (field === 'p' && !value) updated[name].t = false;
      if (field === 't' && value)  updated[name].p = true;
      return updated;
    });
  }

  async function handleAdd() {
    if (!matchId || !rival) return;
    setSaving(true);
    const lineup = players.filter(pl => stats[pl.name]?.t).map(pl => pl.name);
    const bench  = players.filter(pl => stats[pl.name]?.p && !stats[pl.name]?.t).map(pl => pl.name);
    const newMatch: Match = { id: matchId, type, rival, date: date || '?', goalsFor: gf, goalsAgainst: ga, outcome, lineup, bench };
    const newGoals: Goal[] = [];
    players.forEach(pl => {
      for (let i = 0; i < (stats[pl.name]?.g ?? 0); i++) {
        newGoals.push({ matchId, date: date || '?', rival, scorer: pl.name, type: 'Ataque rapido' });
      }
    });
    onAdd(newMatch, newGoals);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#0A1A3E] border border-white/15 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-black text-lg">＋ Agregar Partido</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl cursor-pointer">✕</button>
        </div>

        <div className="px-5 py-4 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-white/40 text-[10px] block mb-1">ID del Partido *</label>
              <input className={INPUT} value={matchId} onChange={e => setMatchId(e.target.value)} placeholder="9, CC3, A4…" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] block mb-1">Tipo</label>
              <select className={SELECT} value={type} onChange={e => setType(e.target.value as MatchType)}>
                <option value="Liga">Liga</option>
                <option value="Copa">Copa</option>
                <option value="Amistoso">Amistoso</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-white/40 text-[10px] block mb-1">Rival *</label>
              <input className={INPUT} value={rival} onChange={e => setRival(e.target.value)} placeholder="Nombre del rival" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] block mb-1">Fecha</label>
              <input className={INPUT} value={date} onChange={e => setDate(e.target.value)} placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] block mb-1">G. Favor</label>
              <input type="number" min={0} className={INPUT} value={gf}
                onChange={e => { const v = +e.target.value; setGf(v); setOutcome(autoOutcome(v, ga)); }} />
            </div>
            <div>
              <label className="text-white/40 text-[10px] block mb-1">G. Contra</label>
              <input type="number" min={0} className={INPUT} value={ga}
                onChange={e => { const v = +e.target.value; setGa(v); setOutcome(autoOutcome(gf, v)); }} />
            </div>
            <div>
              <label className="text-white/40 text-[10px] block mb-1">Resultado</label>
              <select className={SELECT} value={outcome} onChange={e => setOutcome(e.target.value as Outcome)}>
                <option value="V">Victoria</option>
                <option value="E">Empate</option>
                <option value="D">Derrota</option>
              </select>
            </div>
          </div>

          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Estadísticas por Jugador</p>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-white/10">
              <PlayerStatsTable players={players} stats={stats} onChange={changeField} />
            </div>
            <div className="mt-3">
              <AddPlayerForm
                existingIds={players.map(p => p.id)}
                onAdd={p => { onAddPlayer(p); }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button onClick={onClose} className="text-white/50 hover:text-white text-sm px-4 py-2 cursor-pointer">Cancelar</button>
            <button
              onClick={handleAdd}
              disabled={!matchId || !rival || saving}
              className="bg-[#F5A623] hover:bg-[#d4911e] text-[#0A1A3E] font-black px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 text-sm"
            >
              {saving ? 'Guardando…' : '✓ Agregar Partido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [players,    setPlayers]    = useState<Player[]>([]);
  const [matches,    setMatches]    = useState<Match[]>([]);
  const [goals,      setGoals]      = useState<Goal[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showAdd,    setShowAdd]    = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const loadData = useCallback(async () => {
    const res = await fetch('/api/admin/data');
    const data = await res.json();
    setPlayers(data.players);
    setMatches(data.matches);
    setGoals(data.goals);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function saveType(type: 'matches' | 'goals' | 'players', data: unknown) {
    setSaveStatus('saving');
    await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }

  async function handleMatchSave(updatedMatch: Match, updatedGoals: Goal[]) {
    const newMatches = matches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    setMatches(newMatches);
    setGoals(updatedGoals);
    const newPlayers = recalcPlayerStats(players, newMatches, updatedGoals);
    setPlayers(newPlayers);
    await Promise.all([
      saveType('matches', newMatches),
      saveType('goals', updatedGoals),
      saveType('players', newPlayers),
    ]);
  }

  async function handleMatchDelete(matchId: string) {
    const newMatches = matches.filter(m => m.id !== matchId);
    const newGoals   = goals.filter(g => g.matchId !== matchId);
    setMatches(newMatches);
    setGoals(newGoals);
    const newPlayers = recalcPlayerStats(players, newMatches, newGoals);
    setPlayers(newPlayers);
    await Promise.all([
      saveType('matches', newMatches),
      saveType('goals', newGoals),
      saveType('players', newPlayers),
    ]);
  }

  async function handleMatchAdd(newMatch: Match, newGoals: Goal[]) {
    const updatedMatches = [...matches, newMatch];
    const updatedGoals   = [...goals, ...newGoals];
    setMatches(updatedMatches);
    setGoals(updatedGoals);
    setShowAdd(false);
    const newPlayers = recalcPlayerStats(players, updatedMatches, updatedGoals);
    setPlayers(newPlayers);
    await Promise.all([
      saveType('matches', updatedMatches),
      saveType('goals', updatedGoals),
      saveType('players', newPlayers),
    ]);
  }

  async function handleAddPlayer(newPlayer: Player) {
    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    await saveType('players', updatedPlayers);
  }

  function recalcPlayerStats(pls: Player[], mts: Match[], gls: Goal[]): Player[] {
    return pls.map(pl => {
      const apps   = mts.filter(m => m.lineup.includes(pl.name) || m.bench.includes(pl.name)).length;
      const starts = mts.filter(m => m.lineup.includes(pl.name)).length;
      const gs     = gls.filter(g => g.scorer === pl.name).length;
      return { ...pl, appearances: apps, starts, goals: gs };
    });
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  // Sort matches chronologically; unknown dates go to the end
  const sortedMatches = [...matches].sort((a, b) => parseDateMs(a.date) - parseDateMs(b.date));

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A1A3E] flex items-center justify-center">
        <p className="text-white/50">Cargando datos…</p>
      </main>
    );
  }

  const totalGoals = goals.filter(g => g.scorer !== 'Autogol').length;

  return (
    <main className="min-h-screen bg-[#0A1A3E]">
      <header className="bg-[#0A1A3E] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="CDT" width={36} height={36} className="drop-shadow" />
            <div>
              <p className="text-white font-black text-sm leading-none">CS DI TESTA</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && <span className="text-white/40 text-xs">Guardando…</span>}
            {saveStatus === 'saved'  && <span className="text-emerald-400 text-xs">✓ Guardado</span>}
            <a href="/" target="_blank" className="text-white/40 hover:text-white text-xs px-3 py-1.5 border border-white/15 rounded-lg">
              Ver sitio ↗
            </a>
            <button onClick={handleLogout} className="text-white/40 hover:text-white text-xs px-3 py-1.5 border border-white/15 rounded-lg cursor-pointer">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Partidos', value: matches.length, color: 'text-white'     },
            { label: 'Goles',    value: totalGoals,     color: 'text-[#F5A623]' },
            { label: 'Jugadores',value: players.length, color: 'text-sky-300'   },
          ].map(s => (
            <div key={s.label} className="bg-[#11296B]/40 border border-white/10 rounded-xl py-4 text-center">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-white font-black text-lg">
            Partidos <span className="text-white/30 text-sm font-normal ml-1">ordenados por fecha</span>
          </h2>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[#F5A623] hover:bg-[#d4911e] text-[#0A1A3E] font-black px-5 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            ＋ Agregar Partido
          </button>
        </div>

        <div className="space-y-3">
          {sortedMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              players={players}
              goals={goals}
              onSave={handleMatchSave}
              onDelete={() => handleMatchDelete(match.id)}
              onAddPlayer={handleAddPlayer}
            />
          ))}
        </div>
      </div>

      {showAdd && (
        <AddMatchModal
          players={players}
          onClose={() => setShowAdd(false)}
          onAdd={handleMatchAdd}
          onAddPlayer={handleAddPlayer}
        />
      )}
    </main>
  );
}
