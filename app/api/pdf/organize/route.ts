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
    const pageOrderJson = formData.get('pageOrder') as string || '[]';

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const pageOrder: number[] = JSON.parse(pageOrderJson);
    if (!Array.isArray(pageOrder) || pageOrder.length === 0) {
      return NextResponse.json({ code: 'INVALID_INPUT', error: 'Urutan halaman tidak valid.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    for (const idx of pageOrder) {
      if (idx < 0 || idx >= totalPages) {
        return NextResponse.json({ code: 'INVALID_INPUT', error: `Halaman index ${idx} tidak valid. Total halaman: ${totalPages}` }, { status: 400 });
      }
    }

    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(srcDoc, pageOrder);
    pages.forEach((p) => newDoc.addPage(p));
    const organizedBytes = await newDoc.save();

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(organizedBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent('organized.pdf')}`,
      fileName: 'organized.pdf',
      sizeBytes: organizedBytes.length,
    });
  } catch (err) {
    console.error('Organize PDF error:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: `Gagal mengatur ulang PDF: ${message}` }, { status: 500 });
  }
}
