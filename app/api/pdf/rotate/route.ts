import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib-with-encrypt';
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
    const angle = parseInt(formData.get('angle') as string) || 90;

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pages = doc.getPages();
    pages.forEach((p) => p.setRotation(degrees(p.getRotation().angle + angle)));
    const rotatedBytes = await doc.save();

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(rotatedBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=rotated.pdf`,
      fileName: 'rotated.pdf',
      sizeBytes: rotatedBytes.length,
    });
  } catch (err) {
    console.error('Rotate PDF error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal memutar file PDF.' }, { status: 500 });
  }
}
