'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  emoji: string;
  title: string;
  text: string;
  date: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    emoji: '🔥',
    title: 'PIBE INTRATABLE',
    text: 'Pibe sigue intratable y marca 2 goles más esta fecha. ¿Alguien lo para?',
    date: '15/06/2026',
  },
  {
    id: '2',
    emoji: '🐣',
    title: 'DEBUT GOLEADOR',
    text: 'Debut goleador de uno de los terneros: Borja Patrón. ¡Felicidades crack!',
    date: '15/06/2026',
  },
  {
    id: '3',
    emoji: '⚔️',
    title: 'SE VIENE LA SEMI',
    text: 'Linda semana por delante: semifinal testana vs. Cabaleros. ¡Todos a las canchas!',
    date: '15/06/2026',
  },
];

export default function News() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % NEWS_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const item = NEWS_ITEMS[current];

  return (
    <div className="bg-gradient-to-r from-[#11296B]/40 to-[#1a3a8f]/40 border border-[#F5A623]/20 rounded-lg px-4 py-3 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-black text-[10px] uppercase tracking-widest">
          TESTANEWS
        </h3>
        <span className="text-white/40 text-[9px]">{item.date}</span>
      </div>

      {/* News content */}
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{item.emoji}</span>
        <div className="min-w-0 flex-1">
          <h4 className="text-[#F5A623] font-bold text-xs uppercase tracking-wide mb-1">
            {item.title}
          </h4>
          <p className="text-white/85 text-sm leading-relaxed">
            {item.text}
          </p>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex gap-1.5 mt-3 justify-center">
        {NEWS_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
              i === current ? 'bg-[#F5A623] w-3' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
