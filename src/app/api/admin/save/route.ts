import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ALLOWED  = new Set(['matches', 'goals', 'players']);
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'csdt-admin-2026';
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_STORE_ID = process.env.BLOB_STORE_ID;
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
    // Production: use Vercel Blob SDK (official/supported)
    if (IS_PRODUCTION) {
      console.log(`[Blob Save] Starting SDK-based save for type: ${type}`);

      try {
        const { put } = await import('@vercel/blob');
        console.log(`[Blob Save] Calling put() with access: private, allowOverwrite: true`);

        const result = await put(type, JSON.stringify(data), {
          access: 'public',
          allowOverwrite: true,
          contentType: 'application/json',
        });

        console.log(`[Blob Save] Success! URL:`, result.url);
        return NextResponse.json({ ok: true, storage: 'blob', url: result.url });
      } catch (blobErr) {
        const errorMsg = blobErr instanceof Error
          ? `${blobErr.name}: ${blobErr.message}`
          : JSON.stringify(blobErr);
        console.error('[Blob Save] SDK error:', errorMsg);
        console.error('[Blob Save] Full error:', blobErr);
        return NextResponse.json(
          { error: `Blob save failed: ${errorMsg}` },
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
