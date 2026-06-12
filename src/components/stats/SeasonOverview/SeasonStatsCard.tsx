'use client';

interface Props {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}

export default function SeasonStatsCard({ label, value, subtext, highlight }: Props) {
  return (
    <div className={`rounded-xl border p-4 transition-colors ${
      highlight
        ? 'bg-[#11296B]/60 border-[#F5A623]/30 hover:bg-[#1a3a8f]/60'
        : 'bg-[#11296B]/40 border-white/10 hover:bg-[#1a3a8f]/40'
    }`}>
      <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-2">
        {label}
      </p>
      <p className={`font-black text-3xl mb-1 ${
        highlight ? 'text-[#F5A623]' : 'text-white'
      }`}>
        {value}
      </p>
      {subtext && (
        <p className="text-white/50 text-[12px]">
          {subtext}
        </p>
      )}
    </div>
  );
}
