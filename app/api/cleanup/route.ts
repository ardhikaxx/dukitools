import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import path from 'path';

const TEMP_DIR = process.env.TEMP_STORAGE_PATH ?? '/tmp/dukitools';
const TTL_MS = Number(process.env.TEMP_FILE_TTL_MINUTES ?? 15) * 60 * 1000;

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-cleanup-token');
  if (token !== process.env.CLEANUP_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const files = await readdir(TEMP_DIR);
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      try {
        const stats = await stat(filePath);
        if (Date.now() - stats.mtimeMs > TTL_MS) {
          await unlink(filePath);
          deletedCount++;
        }
      } catch {
        // skip files that can't be accessed
      }
    }

    return NextResponse.json({ deletedCount });
  } catch {
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
