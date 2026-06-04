'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      // Hard redirect so the proxy middleware re-runs and sees the new cookie
      window.location.href = '/admin';
    } else {
      const data = await res.json();
      setError(data.error ?? 'Error desconocido');
    }
  }

  return (
    <main className="min-h-screen bg-[#0A1A3E] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo + branding */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="CS Di Testa" width={72} height={72} className="drop-shadow-lg mb-4" />
          <h1 className="text-white font-black text-2xl tracking-tight">CS DI TESTA</h1>
          <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Panel de Administración</p>
        </div>

        {/* Card */}
        <div className="bg-[#11296B]/60 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#0A1A3E] border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-[#F5A623] outline-none transition-colors"
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0A1A3E] border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-[#F5A623] outline-none transition-colors"
                placeholder="••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5A623] hover:bg-[#d4911e] text-[#0A1A3E] font-black py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          CS Di Testa · Temporada 2026
        </p>
      </div>
    </main>
  );
}
