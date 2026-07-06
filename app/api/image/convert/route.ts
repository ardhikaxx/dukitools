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
    const targetFormat = (formData.get('targetFormat') as string || 'png').toLowerCase();

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extMap: Record<string, string> = { png: '.png', jpg: '.jpg', jpeg: '.jpg', webp: '.webp', heic: '.png' };
    const ext = extMap[targetFormat] || '.png';

    let converted: Buffer;
    switch (targetFormat) {
      case 'png':
        converted = await sharp(buffer).png().toBuffer();
        break;
      case 'jpg':
      case 'jpeg':
        converted = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
        break;
      case 'webp':
        converted = await sharp(buffer).webp({ quality: 85 }).toBuffer();
        break;
      default:
        converted = await sharp(buffer).png().toBuffer();
    }

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, converted);

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(`converted${ext}`)}`,
      fileName: `converted${ext}`,
      sizeBytes: converted.length,
    });
  } catch (err) {
    console.error('Convert image error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengonversi gambar.' }, { status: 500 });
  }
}
