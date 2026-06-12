'use client';

import { useState } from 'react';
import { Player, Goal, Match } from '@/data/types';
import PositionView from './PositionView';
import Leaderboard from './Leaderboard';
import PitchView from './PitchView';
import FixtureView from './FixtureView';
import TeamCarousel from './TeamCarousel';
import TeamStats from './stats/TeamStats';

type Tab = 'cancha' | 'goleadores' | 'fixture' | 'posicion' | 'stats' | 'fotos';

const TABS: { id: Tab; label: string; shortLabel: string }[] = [
  { id: 'cancha',      label: 'Cancha',       shortLabel: 'Cancha'   },
  { id: 'goleadores',  label: 'Goleadores',   shortLabel: 'Goles'    },
  { id: 'fixture',     label: 'Fixture',      shortLabel: 'Fixture'  },
  { id: 'posicion',    label: 'Por Posición', shortLabel: 'Posición' },
  { id: 'stats',       label: 'Estadísticas', shortLabel: 'Stats'    },
  { id: 'fotos',       label: 'Fotos',        shortLabel: 'Fotos'    },
];

interface Props {
  players: Player[];
  goals: Goal[];
  matches: Match[];
}

export default function Dashboard({ players, goals, matches }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('cancha');

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-0.5 sm:gap-1 p-1 bg-[#11296B]/40 rounded-xl border border-white/10 w-max snap-x snap-mandatory">
          {TABS.map(({ id, label, shortLabel }) => (
            <TabButton
              key={id}
              active={activeTab === id}
              onClick={() => setActiveTab(id)}
              shortLabel={shortLabel}
            >
              {label}
            </TabButton>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        {activeTab === 'cancha'      && <PitchView    players={players} matches={matches} goals={goals} />}
        {activeTab === 'goleadores'  && <Leaderboard  players={players} goals={goals} matches={matches} />}
        {activeTab === 'fixture'     && <FixtureView  matches={matches} goals={goals} players={players} />}
        {activeTab === 'posicion'    && <PositionView players={players} matches={matches} goals={goals} />}
        {activeTab === 'stats'       && <TeamStats    players={players} matches={matches} goals={goals} />}
        {activeTab === 'fotos'       && <TeamCarousel />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  shortLabel,
  children,
}: {
  active: boolean;
  onClick: () => void;
  shortLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 snap-start px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold
        transition-all duration-150 cursor-pointer whitespace-nowrap
        ${active
          ? 'bg-[#11296B] text-white shadow-md shadow-black/30'
          : 'text-white/50 hover:text-white/80'
        }
      `}
    >
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}


