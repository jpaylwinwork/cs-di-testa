import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-[#0A1A3E] border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="CS Di Testa"
              width={56}
              height={56}
              className="w-full h-full object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl tracking-tight leading-none">
              CS DI TESTA
            </h1>
            <p className="text-white/50 text-xs tracking-widest uppercase mt-0.5">
              Club Social y Deportivo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-[#F5A623]/15 border border-[#F5A623]/40">
            <span className="text-[#F5A623] text-xs font-bold tracking-widest uppercase">
              Temporada 2026
            </span>
          </div>

          {/* Subtle admin link — small lock icon, low visibility */}
          <Link
            href="/admin"
            title="Acceso administrador"
            className="text-white/20 hover:text-white/60 transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
