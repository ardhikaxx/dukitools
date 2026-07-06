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
    const text = (formData.get('text') as string) || '';
    const position = (formData.get('position') as string) || 'bottom-right';
    const opacity = parseInt(formData.get('opacity') as string) || 50;

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }
    if (!text.trim()) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'Teks watermark tidak boleh kosong.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    const imgWidth = metadata.width ?? 800;
    const imgHeight = metadata.height ?? 600;

    const fontSize = Math.max(16, Math.floor(Math.min(imgWidth, imgHeight) / 20));
    const alpha = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');

    let x: number, y: number;
    const padding = 20;
    switch (position) {
      case 'top-left':
        x = padding; y = padding + fontSize;
        break;
      case 'top-right':
        x = imgWidth - padding; y = padding + fontSize;
        break;
      case 'center':
        x = imgWidth / 2; y = imgHeight / 2;
        break;
      case 'bottom-left':
        x = padding; y = imgHeight - padding;
        break;
      case 'bottom-right':
      default:
        x = imgWidth - padding; y = imgHeight - padding;
        break;
    }

    const anchor = position === 'center' ? 'middle' : position.includes('right') ? 'end' : 'start';

    const svg = `<svg width="${imgWidth}" height="${imgHeight}" xmlns="http://www.w3.org/2000/svg">
      <text x="${x}" y="${y}" font-size="${fontSize}" font-family="Arial, sans-serif"
        fill="#000000${alpha}" text-anchor="${anchor}" dominant-baseline="auto"
        transform="rotate(-15, ${x}, ${y})">${escapeXml(text)}</text>
    </svg>`;

    const watermarked = await sharp(buffer)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .toBuffer();

    const id = crypto.randomUUID();
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, watermarked);

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(`watermarked${ext}`)}`,
      fileName: `watermarked${ext}`,
      sizeBytes: watermarked.length,
    });
  } catch (err) {
    console.error('Watermark image error:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: `Gagal menambahkan watermark: ${message}` }, { status: 500 });
  }
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
