# CS Di Testa — Panel de Estadísticas

Dashboard de estadísticas en tiempo real para CS Di Testa, un equipo de fútbol amateur que juega los domingos. Los jugadores pueden ver sus stats individuales de la temporada, el fixture, el álbum del equipo y el historial de partidos.

**Live:** https://www.ditesta.club

---

## Qué Tiene

- **Dashboard de stats** — goles, asistencias, presencias y titularidades por jugador
- **Vista por posición** — agrupado en GK / DEF / MED / DEL, con highlight al mejor de cada línea
- **Leaderboard ordenable** — tabla completa con sort por cualquier columna
- **Vista de cancha** — jugadores posicionados en el campo según su posición
- **Fixture** — calendario de partidos con resultado y modal de detalle
- **Álbum del equipo** — galería de fotos de la temporada
- **Panel de admin** — para actualizar datos sin tocar código ni redesployar

---

## Arquitectura

La parte interesante no es la UI — es cómo se actualiza la data.

```
┌─────────────────────────────────────────────┐
│  Admin Panel (/admin)                        │
│  Autenticación por cookie · Acceso protegido │
└──────────────────┬──────────────────────────┘
                   │ POST /api/update
                   ▼
┌─────────────────────────────────────────────┐
│  Vercel Blob (private)                       │
│  players.json · matches.json · goals.json    │
└──────────────────┬──────────────────────────┘
                   │ getPlayers() / getMatches() / getGoals()
                   ▼
┌─────────────────────────────────────────────┐
│  Next.js Server Components (SSR)             │
│  Lee Blob en prod · JSON local en dev        │
└─────────────────────────────────────────────┘
```

El adminl actualiza los datos vía Blob — el sitio refleja los cambios en el siguiente request, sin redeploy. En desarrollo, la app cae a archivos JSON locales como fallback.

---

## Stack

- **Next.js 16** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS v4**
- **Vercel Blob** — persistencia de datos en producción
- **lucide-react** — iconografía
- **Dominio custom:** ditesta.club

---

## Cómo Correrlo Localmente

```bash
npm install
npm run dev
```

Para datos en desarrollo, crea `src/data/runtime/players.json`, `matches.json` y `goals.json` — o deja los archivos `.ts` estáticos como fuente.

---

## Decisiones de Producto

- **Blob sobre base de datos** — para un equipo de 25 personas, una base de datos es overkill. Blob + JSON es suficiente, sin costo adicional y sin operaciones.
- **Admin con cookie simple** — no necesita OAuth ni user management. Un secret compartido basta para el caso de uso.
- **SSR sin caché** — `force-dynamic` asegura que cada visita ve los datos más recientes del Blob, sin TTL ni invalidación manual.
- **Fallback estático** — en dev no dependés de Vercel Blob. Los datos `.ts` sirven de fuente hasta que haya datos reales en el Blob.
