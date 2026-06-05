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
    emoji: '🎉',
    title: 'FIESTA TESTANA',
    text: '+3 el martes; +3 el jueves y +3 en Mendoza. Semana redonda de +9 ptos para los Toros de Fontova.',
    date: '27/05/2026',
  },
  {
    id: '2',
    emoji: '🤯',
    title: 'INSÓLITO',
    text: 'Pedro Córdova NO perdió NINGUNA PELOTA durante todo el partido. ¡Desnudez TOTAL del toro de ojos locos!',
    date: '27/05/2026',
  },
  {
    id: '3',
    emoji: '💪',
    title: 'CAEN ALGUNOS 100%',
    text: 'Felicidades a los toros que mantienen su compromiso absoluto con el equipo. Lo de Barriga es tremendo.',
    date: '27/05/2026',
  },
  {
    id: '4',
    emoji: '🏆',
    title: 'VIENE LO MEJOR...',
    text: 'Kuramen el martes para cerrar fase regular. De ganar los próximos 3 partidos, el toro se coronaría campeón.',
    date: '27/05/2026',
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
