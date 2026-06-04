'use client';

import { useState } from 'react';
import { Player, Goal, Match } from '@/data/types';
import PositionView from './PositionView';
import Leaderboard from './Leaderboard';
import PitchView from './PitchView';
import FixtureView from './FixtureView';

type Tab = 'position' | 'leaderboard' | 'cancha' | 'fixture';

interface Props {
  players: Player[];
  goals: Goal[];
  matches: Match[];
}

export default function Dashboard({ players, goals, matches }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('position');

  return (
    <div>
      <div className="flex flex-wrap gap-1 p-1 bg-[#11296B]/40 rounded-xl border border-white/10 w-fit">
        <TabButton active={activeTab === 'position'}    onClick={() => setActiveTab('position')}>
          Por Posición
        </TabButton>
        <TabButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')}>
          Tabla
        </TabButton>
        <TabButton active={activeTab === 'cancha'}      onClick={() => setActiveTab('cancha')}>
          Cancha
        </TabButton>
        <TabButton active={activeTab === 'fixture'}     onClick={() => setActiveTab('fixture')}>
          Fixture
        </TabButton>
      </div>

      <div className="mt-6">
        {activeTab === 'position'    && <PositionView players={players} />}
        {activeTab === 'leaderboard' && <Leaderboard  players={players} goals={goals} />}
        {activeTab === 'cancha'      && <PitchView    players={players} matches={matches} goals={goals} />}
        {activeTab === 'fixture'     && <FixtureView  matches={matches} goals={goals} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer
        ${active
          ? 'bg-[#11296B] text-white shadow-md shadow-black/30'
          : 'text-white/50 hover:text-white/80'
        }
      `}
    >
      {children}
    </button>
  );
}
