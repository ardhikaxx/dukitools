import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 60;

const TEMP_DIR = process.env.TEMP_STORAGE_PATH ?? path.join(process.cwd(), 'tmp');

async function chromaKeyRemoveBg(buffer: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const threshold = 40;
  const edgePixels = sampleEdgePixels(data, info.width, info.height);
  const bg = averageColor(edgePixels);

  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - bg.r;
    const dg = data[i + 1] - bg.g;
    const db = data[i + 2] - bg.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist < threshold) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

function sampleEdgePixels(data: Buffer, w: number, h: number): Array<{ r: number; g: number; b: number }> {
  const pixels: Array<{ r: number; g: number; b: number }> = [];
  const sample = (idx: number) => pixels.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });

  for (let x = 0; x < w; x += Math.max(1, Math.floor(w / 20))) {
    sample(x * 4);
    sample(((h - 1) * w + x) * 4);
  }
  for (let y = 0; y < h; y += Math.max(1, Math.floor(h / 20))) {
    sample(y * w * 4);
    sample((y * w + w - 1) * 4);
  }

  return pixels;
}

function averageColor(pixels: Array<{ r: number; g: number; b: number }>) {
  let r = 0, g = 0, b = 0;
  for (const p of pixels) { r += p.r; g += p.g; b += p.b; }
  const n = pixels.length || 1;
  return { r: r / n, g: g / n, b: b / n };
}

export async function POST(req: NextRequest) {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await chromaKeyRemoveBg(buffer);

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, result);

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=no-background.png`,
      fileName: 'no-background.png',
      sizeBytes: result.length,
    });
  } catch (err) {
    console.error('Remove BG error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal menghapus background.' }, { status: 500 });
  }
}
