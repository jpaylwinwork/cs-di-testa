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

interface Props {
  players: Player[];
  goals: Goal[];
  matches: Match[];
}

export default function Dashboard({ players, goals, matches }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('cancha');

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="flex gap-1 p-1 bg-[#11296B]/40 rounded-xl border border-white/10 w-fit">
        <TabButton active={activeTab === 'cancha'}      onClick={() => setActiveTab('cancha')}>
          Cancha
        </TabButton>
        <TabButton active={activeTab === 'goleadores'}  onClick={() => setActiveTab('goleadores')}>
          Goleadores
        </TabButton>
        <TabButton active={activeTab === 'fixture'}     onClick={() => setActiveTab('fixture')}>
          Fixture
        </TabButton>
        <TabButton active={activeTab === 'posicion'}    onClick={() => setActiveTab('posicion')}>
          Por Posición
        </TabButton>
        <TabButton active={activeTab === 'stats'}       onClick={() => setActiveTab('stats')}>
          Estadísticas
        </TabButton>
        <TabButton active={activeTab === 'fotos'}       onClick={() => setActiveTab('fotos')}>
          Fotos
        </TabButton>
        </div>
      </div>

      <div className="mt-6">
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
