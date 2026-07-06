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

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sizeBefore = buffer.length;

    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const compressedBytes = await doc.save({ useObjectStreams: true });

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(compressedBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=compressed.pdf`,
      fileName: 'compressed.pdf',
      sizeBefore,
      sizeAfter: compressedBytes.length,
    });
  } catch (err) {
    console.error('Compress PDF error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengompresi file PDF.' }, { status: 500 });
  }
}
