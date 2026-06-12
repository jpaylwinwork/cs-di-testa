'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [
  '04066784-8cc4-4bf1-9e92-6e71d25e4b44.jpg',
  'IMG-20220701-WA0078.jpg',
  'IMG-20220706-WA0001.jpg',
  'IMG-20221214-WA0052.jpg',
  'IMG_5861.JPG',
  'IMG_5951.JPG',
  'IMG_9438.JPG',
  'IMG_9732.JPG',
  'SAVE_20201128_192219.jpg',
  'WhatsApp Image 2022-05-14 at 9.38.18 PM (1).jpeg',
  'WhatsApp Image 2022-05-14 at 9.38.18 PM.jpeg',
];

export default function TeamCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % PHOTOS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const prev = () => {
    setCurrent((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
    setAutoPlay(false);
  };

  const next = () => {
    setCurrent((i) => (i + 1) % PHOTOS.length);
    setAutoPlay(false);
  };

  return (
    <div className="relative w-full bg-[#0A1A3E] group">
      {/* Main carousel - 16:9 aspect ratio */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
        <Image
          src={`/team-photos/${PHOTOS[current]}`}
          alt={`Team photo ${current + 1}`}
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlays for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

        {/* Controls - hidden until hover */}
        <button
          onClick={prev}
          aria-label="Foto anterior"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-black/50 hover:bg-black/60 text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={next}
          aria-label="Foto siguiente"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-black/50 hover:bg-black/60 text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setAutoPlay(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current
                  ? 'bg-[#F5A623] w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Photo counter */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 text-white text-xs font-semibold">
          {current + 1} / {PHOTOS.length}
        </div>
      </div>

    </div>
  );
}
