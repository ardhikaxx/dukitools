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
    const quality = parseInt(formData.get('quality') as string) || 75;

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase();
    let compressed: Buffer;

    if (ext === '.png') {
      compressed = await sharp(buffer).png({ quality }).toBuffer();
    } else if (ext === '.webp') {
      compressed = await sharp(buffer).webp({ quality }).toBuffer();
    } else {
      compressed = await sharp(buffer).jpeg({ quality }).toBuffer();
    }

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, compressed);

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(`compressed${ext}`)}`,
      fileName: `compressed${ext}`,
      sizeBefore: buffer.length,
      sizeAfter: compressed.length,
    });
  } catch (err) {
    console.error('Compress image error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengompresi gambar.' }, { status: 500 });
  }
}
