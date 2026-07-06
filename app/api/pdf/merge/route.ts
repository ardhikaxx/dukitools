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
    const files = formData.getAll('files') as File[];

    if (files.length < 2) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'Minimal 2 file diperlukan.' }, { status: 400 });
    }
    if (files.length > 20) {
      return NextResponse.json({ code: 'TOO_MANY_FILES', error: 'Maksimal 20 file.' }, { status: 400 });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (buffer.length === 0) {
        return NextResponse.json({ code: 'FILE_EMPTY', error: 'File kosong.' }, { status: 400 });
      }
      if (buffer.length > 25 * 1024 * 1024) {
        return NextResponse.json({ code: 'FILE_TOO_LARGE', error: 'Ukuran file melebihi 25MB.' }, { status: 400 });
      }
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    }

    const mergedBytes = await mergedPdf.save();
    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(mergedBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=merged.pdf`,
      fileName: 'merged.pdf',
      sizeBytes: mergedBytes.length,
    });
  } catch (err) {
    console.error('Merge PDF error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal menggabungkan file PDF.' }, { status: 500 });
  }
}
