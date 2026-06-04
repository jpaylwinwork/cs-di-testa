# CS Di Testa — Stats Dashboard Requirements

## Overview
A read-only player statistics dashboard for CS Di Testa Sunday League football team. Teammates view individual stats for the current season. No fantasy team creation or management logic in MVP.

## Brand
- **Team Name:** CS Di Testa
- **Primary Colour:** #11296B (deep navy blue)
- **Secondary Colour:** White (#FFFFFF)
- **Accent / Highlight:** #F5A623 (amber gold) — used for top performers
- **Background:** #0A1A3E (slightly darker navy for depth)

## Stats Tracked (per player)
| Stat | Description |
|---|---|
| Goals | Total goals scored this season |
| Assists | Total goal assists this season |
| Appearances | Total matches played |
| Starts | Matches played from minute 0 (starting XI) |

## Player Grouping Logic
### Tab 1 — By Position
- Players are grouped into four sections: **GK → DEF → MID → FWD**
- Within each section, players are sorted by Goals (desc), then Assists (desc)
- The top performer in each section receives a gold left-border highlight
- Each section header shows a colour-coded position badge:
  - GK = amber, DEF = emerald, MID = sky-blue, FWD = rose

### Tab 2 — Leaderboard
- All players in a single sortable table
- Default sort: Goals descending
- Click any column header to sort by that stat; click again to reverse order
- Active sort column is highlighted in gold
- Rank #1 shows a 🥇 medal icon; other ranks show numbers
- Position badge shown inline next to each player's name

## Visual Style
- **Dark Premium / FPL-inspired**
- Dark navy background, card surfaces in brand blue (#11296B)
- White primary text, white/55% opacity for secondary labels
- Gold (#F5A623) for highlights, badges, and top-performer accents
- Hover states lighten the card background slightly
- Responsive: stacked cards on mobile, table layout on desktop

## Data Source
Player data lives in `src/data/players.ts` as a typed TypeScript array.
To update stats from the Google Doc, edit that file — no other changes needed.

## Tech Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- TypeScript
- lucide-react (icons)
