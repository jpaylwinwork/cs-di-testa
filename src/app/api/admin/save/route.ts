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
    // Production: MUST use Vercel Blob via REST API
    if (IS_PRODUCTION) {
      console.log(`[Blob Save] Starting save for type: ${type}, data length: ${JSON.stringify(data).length}`);

      if (!BLOB_READ_WRITE_TOKEN || !BLOB_STORE_ID) {
        console.error('[Blob Save] Missing BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID');
        return NextResponse.json(
          { error: 'Storage not configured. Missing BLOB credentials.' },
          { status: 503 }
        );
      }

      try {
        const url = `https://blob.vercelusercontent.com/put/${type}`;
        console.log(`[Blob Save] Saving to: ${url}`);

        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
            'x-add-random-suffix': 'false',
            'content-type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        console.log(`[Blob Save] Response status: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Blob Save] HTTP ${response.status}:`, errorText);
          return NextResponse.json(
            { error: `Blob save failed: ${response.status} ${errorText}` },
            { status: 503 }
          );
        }

        const result = await response.json();
        console.log(`[Blob Save] Success! Result:`, result);
        return NextResponse.json({ ok: true, storage: 'blob', result });
      } catch (blobErr) {
        console.error('[Blob Save] Error:', blobErr);
        const errorMsg = blobErr instanceof Error ? blobErr.message : JSON.stringify(blobErr);
        return NextResponse.json(
          { error: `Blob storage error: ${errorMsg}` },
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
