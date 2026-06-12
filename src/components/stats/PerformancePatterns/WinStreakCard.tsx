'use client';

import { Match } from '@/data/types';
import { calculateWinStreak } from '@/lib/stats';

interface Props {
  matches: Match[];
}

export default function WinStreakCard({ matches }: Props) {
  const { current, best } = calculateWinStreak(matches);

  return (
    <div className="bg-[#11296B]/60 border border-[#F5A623]/30 rounded-xl p-6 hover:bg-[#1a3a8f]/60 transition-colors">
      <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-4">
        Racha de Victorias
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Current Streak */}
        <div>
          <p className="text-white/50 text-xs mb-2">Actual</p>
          <p className="font-black text-5xl text-white">
            {current}
          </p>
          <p className="text-white/40 text-xs mt-2">victorias</p>
        </div>

        {/* Best Streak */}
        <div>
          <p className="text-white/50 text-xs mb-2">Mejor</p>
          <p className="font-black text-5xl text-[#F5A623]">
            {best}
          </p>
          <p className="text-white/40 text-xs mt-2">consecutivas</p>
        </div>
      </div>
    </div>
  );
}
