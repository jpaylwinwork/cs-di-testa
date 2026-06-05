import { Player } from '@/data/types';

const STAT_COLS = [
  { key: 'goals',       label: 'Goles' },
  { key: 'assists',     label: 'Asist' },
  { key: 'appearances', label: 'PJ'    },
  { key: 'starts',      label: 'Titular' },
] as const;

interface Props {
  player: Player;
  isTop?: boolean;
  rank?: number;
  onClick?: () => void;
}

export default function PlayerCard({ player, isTop = false, rank, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between px-4 py-3 rounded-lg
        bg-[#11296B]/60 hover:bg-[#1a3a8f]/60 transition-colors duration-150
        border ${isTop ? 'border-l-4 border-l-[#F5A623] border-white/10' : 'border-white/8'}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        {rank !== undefined && (
          <span className={`text-sm font-bold w-6 text-center flex-shrink-0 ${rank === 1 ? 'text-[#F5A623]' : 'text-white/40'}`}>
            {rank === 1 ? '🥇' : rank}
          </span>
        )}
        <span className={`font-semibold truncate ${isTop ? 'text-white' : 'text-white/90'}`}>
          {player.name}
        </span>
      </div>

      <div className="flex items-center gap-6 flex-shrink-0 ml-4">
        {STAT_COLS.map(({ key, label }) => (
          <div key={key} className="text-center w-12">
            <div className={`text-base font-bold ${isTop && key === 'goals' ? 'text-[#F5A623]' : 'text-white'}`}>
              {player[key]}
            </div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
