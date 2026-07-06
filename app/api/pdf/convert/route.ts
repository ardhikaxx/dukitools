import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib-with-encrypt';
import { rgb } from 'pdf-lib-with-encrypt';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const maxDuration = 60;

const TEMP_DIR = process.env.TEMP_STORAGE_PATH ?? path.join(process.cwd(), 'tmp');

export async function POST(req: NextRequest) {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetFormat = formData.get('targetFormat') as string || '';

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase();

    // Word to PDF: extract text with mammoth, render into PDF
    if (ext === '.doc' || ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value || '(Tidak ada teks yang dapat diekstrak)';
      const doc = await PDFDocument.create();
      const page = doc.addPage([612, 792]);
      const { width, height } = page.getSize();
      const lines = text.split('\n');
      let y = height - 50;
      for (const line of lines) {
        if (y < 40) break;
        const displayText = line.trim().slice(0, 120) || ' ';
        page.drawText(displayText, { x: 50, y, size: 10, color: rgb(0, 0, 0) });
        y -= 14;
      }
      const pdfBytes = await doc.save();
      const id = crypto.randomUUID();
      const filePath = path.join(TEMP_DIR, id);
      await writeFile(filePath, Buffer.from(pdfBytes));
      return NextResponse.json({
        downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(file.name.replace(/\.\w+$/, '.pdf'))}`,
        fileName: file.name.replace(/\.\w+$/, '.pdf'),
        sizeBytes: pdfBytes.length,
      });
    }

    // PDF to Word: embed page info in a DOCX-like PDF
    if (ext === '.pdf') {
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const doc = await PDFDocument.create();
      const page = doc.addPage([612, 792]);
      const { width, height } = page.getSize();
      page.drawText(`File: ${file.name}`, { x: 50, y: height - 50, size: 14, color: rgb(0, 0, 0) });
      page.drawText(`Total Halaman: ${srcDoc.getPageCount()}`, { x: 50, y: height - 75, size: 11, color: rgb(0.2, 0.2, 0.2) });
      page.drawText('', { x: 50, y: height - 100, size: 11, color: rgb(0.2, 0.2, 0.2) });
      const lines = [
        'Konversi PDF ke Word sedang dalam pengembangan.',
        'Untuk hasil sempurna, gunakan Microsoft Word atau Google Docs.',
        '',
        'Ringkasan dokumen:',
        `- Nama file: ${file.name}`,
        `- Total halaman: ${srcDoc.getPageCount()}`,
      ];
      let y = height - 120;
      for (const line of lines) {
        page.drawText(line, { x: 50, y, size: 11, color: rgb(0, 0, 0) });
        y -= 18;
      }
      const pdfBytes = await doc.save();
      const id = crypto.randomUUID();
      const filePath = path.join(TEMP_DIR, id);
      await writeFile(filePath, Buffer.from(pdfBytes));
      return NextResponse.json({
        downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(file.name.replace(/\.\w+$/, '-converted.pdf'))}`,
        fileName: file.name.replace(/\.\w+$/, '-converted.pdf'),
        sizeBytes: pdfBytes.length,
      });
    }

    return NextResponse.json({ code: 'INVALID_FILE_TYPE', error: 'Format file tidak didukung.' }, { status: 400 });
  } catch (err) {
    console.error('Convert PDF error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengonversi file.' }, { status: 500 });
  }
}
