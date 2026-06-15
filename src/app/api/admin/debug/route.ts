import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = process.env.BLOB_STORE_ID;

  const log: string[] = [];
  log.push(`TOKEN present: ${!!token}`);
  log.push(`TOKEN prefix: ${token?.slice(0, 20)}...`);
  log.push(`STORE_ID: ${storeId}`);

  try {
    const { get, list } = await import('@vercel/blob');

    // Try listing blobs first to see what's in the store
    log.push('Calling list()...');
    const { blobs } = await list();
    log.push(`Found ${blobs.length} blobs: ${blobs.map(b => b.pathname).join(', ')}`);

    // Try getting 'matches' blob
    log.push('Calling get("matches", { access: "private" })...');
    const result = await get('matches', { access: 'private' });
    log.push(`get() statusCode: ${result.statusCode}`);
    log.push(`get() stream null: ${result.stream === null}`);

    if (result.stream) {
      const reader = result.stream.getReader();
      const decoder = new TextDecoder();
      let text = '';
      let chunk;
      while (!(chunk = await reader.read()).done) {
        text += decoder.decode(chunk.value, { stream: true });
      }
      text += decoder.decode();
      log.push(`Read ${text.length} bytes, first 100: ${text.slice(0, 100)}`);
    }

  } catch (err) {
    log.push(`ERROR: ${err instanceof Error ? `${err.name}: ${err.message}` : JSON.stringify(err)}`);
  }

  return NextResponse.json({ log });
}
