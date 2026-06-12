'use client';

import { Goal, Match } from '@/data/types';
import { countStartersVsBench } from '@/lib/stats';

interface Props {
  goals: Goal[];
  matches: Match[];
}

export default function StartersVsBenchCard({ goals, matches }: Props) {
  const { starters, bench, startersPercentage, benchPercentage } = countStartersVsBench(goals, matches);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Starters Card */}
      <div className="bg-[#11296B]/40 border border-white/10 rounded-xl p-5 hover:bg-[#1a3a8f]/40 transition-colors">
        <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-3">
          Titulares
        </p>
        <p className="font-black text-4xl text-white mb-2">
          {starters}
        </p>
        <p className="text-[#F5A623] font-bold text-lg">
          {startersPercentage}%
        </p>
        <p className="text-white/50 text-[12px] mt-2">
          del total de goles
        </p>
      </div>

      {/* Bench Card */}
      <div className="bg-[#11296B]/40 border border-white/10 rounded-xl p-5 hover:bg-[#1a3a8f]/40 transition-colors">
        <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-3">
          Suplentes
        </p>
        <p className="font-black text-4xl text-white mb-2">
          {bench}
        </p>
        <p className="text-emerald-400 font-bold text-lg">
          {benchPercentage}%
        </p>
        <p className="text-white/50 text-[12px] mt-2">
          del total de goles
        </p>
      </div>
    </div>
  );
}
