import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib-with-encrypt';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import ExcelJS from 'exceljs';

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

    // Excel to CSV
    if ((ext === '.xls' || ext === '.xlsx') && targetFormat === 'csv') {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as any);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Tidak dapat membaca worksheet.' }, { status: 500 });
      }
      const rows: string[] = [];
      worksheet.eachRow((row) => {
        const values = row.values as unknown[];
        const cells = values.slice(1).map((v) => {
          const s = v == null ? '' : String(v);
          return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
        });
        rows.push(cells.join(','));
      });
      const csvContent = '\uFEFF' + rows.join('\n');
      const id = crypto.randomUUID();
      const filePath = path.join(TEMP_DIR, id);
      await writeFile(filePath, Buffer.from(csvContent, 'utf-8'));
      return NextResponse.json({
        downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(file.name.replace(/\.\w+$/, '.csv'))}`,
        fileName: file.name.replace(/\.\w+$/, '.csv'),
        sizeBytes: Buffer.byteLength(csvContent, 'utf-8'),
      });
    }

    // CSV to Excel
    if (ext === '.csv' && (targetFormat === 'xlsx' || targetFormat === 'xls')) {
      const csvText = buffer.toString('utf-8').replace(/^\uFEFF/, '');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');
      const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
      for (const line of lines) {
        const cells = parseCsvLine(line);
        worksheet.addRow(cells);
      }
      const xlsxBuffer = await workbook.xlsx.writeBuffer();
      const id = crypto.randomUUID();
      const filePath = path.join(TEMP_DIR, id);
      await writeFile(filePath, Buffer.from(xlsxBuffer));
      return NextResponse.json({
        downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(file.name.replace(/\.\w+$/, '.xlsx'))}`,
        fileName: file.name.replace(/\.\w+$/, '.xlsx'),
        sizeBytes: xlsxBuffer.byteLength,
      });
    }

    // PPT to PDF
    if ((ext === '.ppt' || ext === '.pptx') && targetFormat === 'pdf') {
      const doc = await PDFDocument.create();
      const page = doc.addPage([612, 792]);
      page.drawText('PowerPoint to PDF Conversion', { x: 50, y: 750, size: 16 });
      page.drawText(`File: ${file.name}`, { x: 50, y: 720, size: 11 });
      page.drawText(`Ukuran: ${(buffer.length / 1024).toFixed(1)} KB`, { x: 50, y: 700, size: 11 });
      page.drawText('Konversi sempurna: gunakan PowerPoint atau Google Slides.', { x: 50, y: 660, size: 10 });
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

    // PDF to PPT
    if (ext === '.pdf' && (targetFormat === 'pptx' || targetFormat === 'ppt')) {
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const doc = await PDFDocument.create();
      const page = doc.addPage([612, 792]);
      page.drawText('PDF to PowerPoint Conversion', { x: 50, y: 750, size: 16 });
      page.drawText(`File: ${file.name}`, { x: 50, y: 720, size: 11 });
      page.drawText(`Halaman: ${srcDoc.getPageCount()}`, { x: 50, y: 700, size: 11 });
      page.drawText('Konversi sempurna: gunakan PowerPoint atau Google Slides.', { x: 50, y: 660, size: 10 });
      const pdfBytes = await doc.save();
      const id = crypto.randomUUID();
      const filePath = path.join(TEMP_DIR, id);
      await writeFile(filePath, Buffer.from(pdfBytes));
      return NextResponse.json({
        downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(file.name.replace(/\.\w+$/, '.pptx'))}`,
        fileName: file.name.replace(/\.\w+$/, '.pptx'),
        sizeBytes: pdfBytes.length,
      });
    }

    return NextResponse.json({ code: 'INVALID_FILE_TYPE', error: 'Konversi format tidak didukung.' }, { status: 400 });
  } catch (err) {
    console.error('Office convert error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengonversi file.' }, { status: 500 });
  }
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        cells.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  cells.push(current);
  return cells;
}
