import { NextRequest, NextResponse } from 'next/server';
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

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(buffer);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'DukiTools';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.columns = [
      { header: 'Line', key: 'line', width: 10 },
      { header: 'Content', key: 'content', width: 100 },
    ];

    const lines = pdfData.text.split('\n').filter((l: string) => l.trim());
    if (lines.length === 0) {
      lines.push('(Tidak ada teks yang dapat diekstrak dari PDF ini)');
    }

    lines.forEach((line: string, i: number) => {
      worksheet.addRow({ line: i + 1, content: line });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' },
    };

    const xlsxBuffer = await workbook.xlsx.writeBuffer();
    const baseName = file.name.replace(/\.pdf$/i, '') || 'pdf';
    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(xlsxBuffer));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(`${baseName}.xlsx`)}`,
      fileName: `${baseName}.xlsx`,
      sizeBytes: xlsxBuffer.byteLength,
    });
  } catch (err) {
    console.error('PDF to Excel error:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: `Gagal mengonversi PDF ke Excel: ${message}` }, { status: 500 });
  }
}
