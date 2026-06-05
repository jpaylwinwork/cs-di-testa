import { headers } from 'next/headers';
import { getPlayers, getMatches, getGoals } from '@/lib/getData';
import Header from '@/components/Header';
import News from '@/components/News';
import Dashboard from '@/components/Dashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const h = await headers();
  h.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  return { title: 'CS Di Testa' };
}

export default async function Page() {
  const [players, matches, goals] = await Promise.all([
    getPlayers(),
    getMatches(),
    getGoals(),
  ]);

  return (
    <main className="min-h-screen bg-[#0A1A3E]">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <News />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Dashboard players={players} goals={goals} matches={matches} />
      </div>
    </main>
  );
}
