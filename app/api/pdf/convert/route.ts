import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib-with-encrypt';
import { rgb } from 'pdf-lib-with-encrypt';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType } from 'docx';
import pdfParse from 'pdf-parse';

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

    // PDF to Word: extract text with pdf-parse, create proper .docx
    if (ext === '.pdf') {
      const pdfData = await pdfParse(buffer);
      const paragraphs = pdfData.text
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => new Paragraph({ children: [new TextRun({ text: line, size: 22 })] }));

      if (paragraphs.length === 0) {
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: '(Tidak ada teks yang dapat diekstrak dari PDF ini)', size: 22 })] }));
      }

      const doc = new Document({
        title: file.name.replace(/\.\w+$/, ''),
        description: `Konversi dari ${file.name}`,
        creator: 'DukiTools',
        sections: [{
          properties: {},
          headers: {
            default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: file.name, size: 16, color: '888888' })] })] }),
          },
          footers: {
            default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Dibuat dengan DukiTools', size: 16, color: '888888' })] })] }),
          },
          children: paragraphs,
        }],
      });

      const docxBytes = await Packer.toBuffer(doc);
      const id = crypto.randomUUID();
      const filePath = path.join(TEMP_DIR, id);
      await writeFile(filePath, Buffer.from(docxBytes));
      return NextResponse.json({
        downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(file.name.replace(/\.\w+$/, '.docx'))}`,
        fileName: file.name.replace(/\.\w+$/, '.docx'),
        sizeBytes: docxBytes.length,
      });
    }

    return NextResponse.json({ code: 'INVALID_FILE_TYPE', error: 'Format file tidak didukung.' }, { status: 400 });
  } catch (err) {
    console.error('Convert PDF error:', err);
    const msg = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: `Gagal mengonversi file: ${msg}` }, { status: 500 });
  }
}
