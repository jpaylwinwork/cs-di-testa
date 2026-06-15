'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface AlbumPhoto {
  id: string;
  title: string;
}

const ALBUM_PHOTOS: AlbumPhoto[] = [
  { id: '0393ce35-0b5e-4ab6-bb61-76debbc50b80.jpeg', title: 'Cachebanca' },
  { id: '0b1bc157-70a6-470c-b750-56ef4c858e1f.jpeg', title: 'Mr M' },
  { id: '186993d1-3b2f-4de0-be1f-7920b2b1e5e4.jpeg', title: 'Lila' },
  { id: '2e9b4118-c417-4a78-883a-7818e8a8044e.jpeg', title: 'Ali G' },
  { id: '34ed7794-8224-4696-9888-c45ba95656fd.jpeg', title: 'Pulpo' },
  { id: '4a8833ef-3acf-4b6a-92bd-ba40e70701a9.jpeg', title: 'Francella Toro' },
  { id: '6aed0801-f645-4505-adaa-c1f6b88cf62c.jpeg', title: 'CC2' },
  { id: '8aa2f906-3bdb-4197-a09d-78dba351091e.jpeg', title: 'MolIA' },
  { id: '8fd599ef-13b2-42a5-831d-0bcf1e8192e0.jpeg', title: 'Pillaje' },
  { id: 'a81999c8-2685-4bdb-96b7-d7bc8048ea54.jpeg', title: 'Ternero Debut' },
  { id: 'd123cde4-b87c-4545-8882-8f9e402c286f.jpeg', title: 'Capitán Legendario' },
  { id: 'd8f3650f-4f18-4692-92b2-e0c6104db1ed.jpeg', title: 'Pillaje 2' },
  { id: 'e46f9cc0-6058-4217-97a7-b98b9393c5c4.jpeg', title: 'Otro Día Oficina' },
  // New photos
  { id: 'PHOTO-2025-08-06-09-09-00.jpg', title: 'Carbs' },
  { id: 'PHOTO-2025-10-13-16-52-13.jpg', title: 'Toro Forte' },
  { id: 'PHOTO-2025-12-17-15-52-03.jpg', title: 'Abupapa' },
  { id: 'PHOTO-2025-12-31-12-55-00.jpg', title: 'Save the Date' },
  { id: 'PHOTO-2026-03-17-14-56-19.jpg', title: 'Moli Sniper' },
  { id: 'PHOTO-2026-03-31-23-16-14.jpg', title: 'Caravana Testana' },
  { id: 'PHOTO-2026-03-31-23-22-10.jpg', title: 'WDW' },
  { id: 'PHOTO-2026-04-02-08-49-15.jpg', title: 'Aragna' },
  { id: 'PHOTO-2026-04-08-17-14-44.jpg', title: 'Grounding' },
  { id: 'PHOTO-2026-04-09-10-14-32.jpg', title: 'WW' },
  { id: 'PHOTO-2026-05-01-13-29-31.jpg', title: 'Pillaje Monjas' },
  { id: 'PHOTO-2026-05-06-10-29-54.jpg', title: 'Pulponeta' },
];

function getRandomRotation(index: number): number {
  // Pseudo-random but consistent per index
  return ((index * 137) % 5) - 2; // -2 to 2 degrees
}

export default function AlbumGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {/* Album Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {ALBUM_PHOTOS.map((photo, index) => {
          const rotation = getRandomRotation(index);

          return (
            <button
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              className="group flex flex-col transition-all duration-200 focus:outline-none"
            >
              {/* Sticker Frame */}
              <div
                className="relative flex-1 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-2xl hover:scale-105"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  boxShadow: [10, 15].includes(index)
                    ? '0 10px 30px rgba(245, 166, 35, 0.4), 0 0 0 3px rgba(245, 166, 35, 0.6)'
                    : '0 10px 25px rgba(0,0,0,0.3), 0 0 0 3px rgba(245, 166, 35, 0.25)',
                  aspectRatio: '3/4',
                }}
              >
                {/* Inner Frame Border (sticker look) - more visible gold */}
                <div
                  className="absolute inset-1 rounded-md pointer-events-none z-10"
                  style={{
                    border: [10, 15].includes(index)
                      ? '2px solid rgba(245, 166, 35, 0.8)'
                      : '2px solid rgba(245, 166, 35, 0.4)',
                  }}
                />

                {/* Image */}
                <Image
                  src={`/team-photos/${photo.id}`}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-110"
                  sizes="(max-width: 640px) calc(50vw - 16px), (max-width: 1024px) calc(33vw - 20px), calc(25vw - 16px)"
                />

                {/* Holographic effect for special cards */}
                {[10, 15].includes(index) && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(45deg, transparent 0%, rgba(245, 166, 35, 0.1) 25%, rgba(100, 200, 255, 0.1) 50%, rgba(255, 100, 200, 0.1) 75%, transparent 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'shimmer 4s linear infinite',
                    }}
                  />
                )}

                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />

                {/* Title overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 text-center">
                  <p className="text-white/90 text-xs font-bold uppercase tracking-widest">
                    {photo.title}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Full-Size Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-[#0A1A3E] rounded-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative aspect-[3/4] w-full bg-black">
              <Image
                src={`/team-photos/${ALBUM_PHOTOS[selectedIndex].id}`}
                alt={ALBUM_PHOTOS[selectedIndex].title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 90vw, 90vw"
              />
              {/* Title in modal */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 text-center">
                <p className="text-white font-bold text-sm uppercase tracking-wider">
                  {ALBUM_PHOTOS[selectedIndex].title}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-[#11296B]/60 border-t border-white/10 p-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedIndex(prev => (prev! - 1 + ALBUM_PHOTOS.length) % ALBUM_PHOTOS.length)}
                className="px-3 py-2 rounded-lg bg-[#11296B] hover:bg-[#1a3a8f] text-white text-sm font-semibold transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-white/60 text-xs">
                {selectedIndex + 1} / {ALBUM_PHOTOS.length}
              </span>
              <button
                onClick={() => setSelectedIndex(prev => (prev! + 1) % ALBUM_PHOTOS.length)}
                className="px-3 py-2 rounded-lg bg-[#11296B] hover:bg-[#1a3a8f] text-white text-sm font-semibold transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
