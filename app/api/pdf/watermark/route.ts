import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib-with-encrypt';
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
    const position = (formData.get('position') as string) || 'center';
    const opacity = parseInt(formData.get('opacity') as string) || 30;

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }
    if (!text.trim()) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'Teks watermark tidak boleh kosong.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = Math.max(12, Math.min(width, height) / 25);
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      let x: number, y: number;
      const padding = 30;
      switch (position) {
        case 'top-left':
          x = padding; y = height - padding;
          break;
        case 'top-right':
          x = width - padding - textWidth; y = height - padding;
          break;
        case 'center':
          x = (width - textWidth) / 2; y = (height - textHeight) / 2;
          break;
        case 'bottom-left':
          x = padding; y = padding + textHeight;
          break;
        case 'bottom-right':
        default:
          x = width - padding - textWidth; y = padding + textHeight;
          break;
      }

      const alpha = opacity / 100;
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: alpha,
        rotate: position === 'center' ? degrees(-30) : undefined,
      });
    }

    const watermarkedBytes = await doc.save();
    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(watermarkedBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent('watermarked.pdf')}`,
      fileName: 'watermarked.pdf',
      sizeBytes: watermarkedBytes.length,
    });
  } catch (err) {
    console.error('Watermark PDF error:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: `Gagal menambahkan watermark: ${message}` }, { status: 500 });
  }
}
