import { NextRequest, NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import path from 'path';

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
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(buffer);

    return NextResponse.json({
      text: pdfData.text || '(Tidak ada teks yang dapat diekstrak)',
      pageCount: pdfData.numpages || 0,
    });
  } catch (err) {
    console.error('PDF to text error:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: `Gagal mengekstrak teks: ${message}` }, { status: 500 });
  }
}
