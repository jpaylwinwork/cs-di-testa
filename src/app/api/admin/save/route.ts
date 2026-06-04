import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const ALLOWED = new Set(['matches', 'goals', 'players']);

export async function POST(request: Request) {
  const { type, data } = await request.json();

  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
  }

  const dir  = path.join(process.cwd(), 'src', 'data', 'runtime');
  const file = path.join(dir, `${type}.json`);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');

  return NextResponse.json({ ok: true });
}
