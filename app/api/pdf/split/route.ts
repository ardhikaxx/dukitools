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
    const startPage = parseInt(formData.get('startPage') as string) || 1;
    const endPage = parseInt(formData.get('endPage') as string);

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    const actualEnd = endPage ? Math.min(endPage, totalPages) : totalPages;
    if (startPage < 1 || startPage > totalPages || actualEnd < startPage) {
      return NextResponse.json({ code: 'INVALID_INPUT', error: `Halaman tidak valid. Total halaman: ${totalPages}` }, { status: 400 });
    }

    const newDoc = await PDFDocument.create();
    const indices = Array.from({ length: actualEnd - startPage + 1 }, (_, i) => startPage - 1 + i);
    const pages = await newDoc.copyPages(srcDoc, indices);
    pages.forEach((p) => newDoc.addPage(p));
    const splitBytes = await newDoc.save();

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(splitBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(`split-pages-${startPage}-${actualEnd}.pdf`)}`,
      fileName: `split-pages-${startPage}-${actualEnd}.pdf`,
      sizeBytes: splitBytes.length,
    });
  } catch (err) {
    console.error('Split PDF error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal memisahkan file PDF.' }, { status: 500 });
  }
}
