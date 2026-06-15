import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ALLOWED  = new Set(['matches', 'goals', 'players']);
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'csdt-admin-2026';
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export async function POST(request: Request) {
  // Check authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token || token.value !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, data } = await request.json();

  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
  }

  try {
    // Production: MUST use Vercel Blob
    if (IS_PRODUCTION) {
      if (!BLOB_TOKEN) {
        console.error('BLOB_TOKEN not found in environment');
        return NextResponse.json(
          { error: 'Storage not configured. Please ensure BLOB_READ_WRITE_TOKEN is set.' },
          { status: 503 }
        );
      }
      try {
        const { put } = await import('@vercel/blob');
        await put(type, JSON.stringify(data), {
          access: 'private',
          allowOverwrite: true,
          contentType: 'application/json',
        });
        return NextResponse.json({ ok: true, storage: 'blob' });
      } catch (blobErr) {
        console.error('Blob save error:', blobErr);
        return NextResponse.json(
          { error: `Blob storage error: ${blobErr instanceof Error ? blobErr.message : 'Unknown error'}` },
          { status: 503 }
        );
      }
    }

    // Development: save to local filesystem
    const fs   = await import('fs/promises');
    const path = await import('path');
    const dir  = path.join(process.cwd(), 'src', 'data', 'runtime');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${type}.json`), JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ ok: true, storage: 'filesystem' });
  } catch (err) {
    console.error(`Save error for ${type}:`, err);
    const errorMsg = err instanceof Error ? err.message : 'Error al guardar';
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
