import { NextResponse } from 'next/server';

const ALLOWED  = new Set(['matches', 'goals', 'players']);
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: Request) {
  const { type, data } = await request.json();

  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
  }

  // Production: save to Vercel Blob
  if (BLOB_TOKEN) {
    const { put } = await import('@vercel/blob');
    await put(type, JSON.stringify(data), {
      access: 'public',
      token: BLOB_TOKEN,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return NextResponse.json({ ok: true, storage: 'blob' });
  }

  // Development: save to local filesystem
  const fs   = await import('fs/promises');
  const path = await import('path');
  const dir  = path.join(process.cwd(), 'src', 'data', 'runtime');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${type}.json`), JSON.stringify(data, null, 2), 'utf-8');
  return NextResponse.json({ ok: true, storage: 'filesystem' });
}
