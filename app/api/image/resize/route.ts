import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
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
    const width = parseInt(formData.get('width') as string) || 0;
    const height = parseInt(formData.get('height') as string) || 0;

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }
    if (!width && !height) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'Masukkan lebar atau tinggi.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase();
    let resized: Buffer;

    resized = await sharp(buffer).resize({ width: width || undefined, height: height || undefined, fit: 'inside', withoutEnlargement: true } as any).toBuffer();

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, resized);

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(`resized${ext}`)}`,
      fileName: `resized${ext}`,
      sizeBytes: resized.length,
    });
  } catch (err) {
    console.error('Resize image error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengubah ukuran gambar.' }, { status: 500 });
  }
}
