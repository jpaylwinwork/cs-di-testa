import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/getData';

export async function GET() {
  const log: string[] = [];
  log.push(`NODE_ENV: ${process.env.NODE_ENV}`);
  log.push(`TOKEN present: ${!!process.env.BLOB_READ_WRITE_TOKEN}`);

  // Test direct Blob get
  try {
    const { get, list } = await import('@vercel/blob');
    const { blobs } = await list();
    log.push(`list() found: ${blobs.map(b => b.pathname).join(', ')}`);

    const result = await get('matches', { access: 'private' });
    if (!result) {
      log.push('get() returned null');
    } else if (result.statusCode === 200 && result.stream) {
      const reader = result.stream.getReader();
      const decoder = new TextDecoder();
      let text = '';
      let chunk;
      while (!(chunk = await reader.read()).done) text += decoder.decode(chunk.value, { stream: true });
      text += decoder.decode();
      const parsed = JSON.parse(text);
      log.push(`Direct Blob get() OK - first match date: ${parsed[0]?.date}, rival: ${parsed[0]?.rival}`);
    } else {
      log.push(`get() statusCode: ${result.statusCode} - no stream`);
    }
  } catch (err) {
    log.push(`Direct Blob ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Test via getData.ts
  try {
    log.push('Calling getMatches() from getData.ts...');
    const matches = await getMatches();
    log.push(`getMatches() returned ${matches.length} matches`);
    log.push(`First match: date=${matches[0]?.date}, rival=${matches[0]?.rival}`);
  } catch (err) {
    log.push(`getMatches() ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }

  return NextResponse.json({ log });
}
