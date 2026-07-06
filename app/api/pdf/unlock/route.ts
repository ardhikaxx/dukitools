import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib-with-encrypt';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 60;

const TEMP_DIR = process.env.TEMP_STORAGE_PATH ?? path.join(process.cwd(), 'tmp');

export async function POST(req: NextRequest) {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const password = formData.get('password') as string || '';

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let doc: Awaited<ReturnType<typeof PDFDocument.load>>;
    try {
      doc = await PDFDocument.load(buffer, { password });
    } catch {
      doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    }
    const unlockedBytes = await doc.save();

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(unlockedBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=unlocked.pdf`,
      fileName: 'unlocked.pdf',
      sizeBytes: unlockedBytes.length,
    });
  } catch (err) {
    console.error('Unlock PDF error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal membuka proteksi PDF. Password mungkin salah.' }, { status: 500 });
  }
}
