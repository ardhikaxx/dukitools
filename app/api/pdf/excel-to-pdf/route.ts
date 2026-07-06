import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib-with-encrypt';
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
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

    for (const worksheet of workbook.worksheets) {
      const rows: string[][] = [];
      worksheet.eachRow((row) => {
        const values = (row.values as unknown[]).slice(1).map((v) =>
          v == null ? '' : String(v)
        );
        rows.push(values);
      });

      if (rows.length === 0) continue;

      const pageWidth = 612;
      const pageHeight = 792;
      const margin = 40;
      const usableWidth = pageWidth - margin * 2;
      const rowHeight = 18;
      const headerHeight = 20;
      const colPadding = 8;

      const colWidths = rows[0].map((_, colIdx) => {
        const maxLen = Math.max(...rows.map((r) => (r[colIdx] || '').length));
        return Math.min(Math.max(maxLen * 7 + colPadding * 2, 60), 300);
      });

      const totalWidth = colWidths.reduce((a, b) => a + b, 0);
      const scale = totalWidth > usableWidth ? usableWidth / totalWidth : 1;
      const scaledWidths = colWidths.map((w) => w * scale);

      let y = pageHeight - margin - headerHeight;
      const page = doc.addPage([pageWidth, pageHeight]);

      const drawRow = (cells: string[], isHeader: boolean, startY: number) => {
        let x = margin;
        for (let i = 0; i < cells.length; i++) {
          const cellText = cells[i] || '';
          const displayText = cellText.length > 40 ? cellText.slice(0, 38) + '..' : cellText;
          page.drawText(displayText, {
            x: x + colPadding * scale,
            y: startY,
            size: isHeader ? 9 : 8,
            font: isHeader ? boldFont : font,
            color: isHeader ? rgb(1, 1, 1) : rgb(0.1, 0.1, 0.1),
            maxWidth: scaledWidths[i] - colPadding * 2 * scale,
          });
          if (isHeader) {
            page.drawRectangle({
              x,
              y: startY - 4,
              width: scaledWidths[i],
              height: headerHeight,
              color: rgb(0.3, 0.3, 0.3),
            });
            page.drawText(displayText, {
              x: x + colPadding * scale,
              y: startY,
              size: 9,
              font: boldFont,
              color: rgb(1, 1, 1),
              maxWidth: scaledWidths[i] - colPadding * 2 * scale,
            });
          } else {
            page.drawRectangle({
              x,
              y: startY - 4,
              width: scaledWidths[i],
              height: rowHeight,
              color: i % 2 === 0 ? rgb(0.97, 0.97, 0.97) : rgb(1, 1, 1),
              borderColor: rgb(0.85, 0.85, 0.85),
              borderWidth: 0.5,
            });
            page.drawText(displayText, {
              x: x + colPadding * scale,
              y: startY,
              size: 8,
              font,
              color: rgb(0.1, 0.1, 0.1),
              maxWidth: scaledWidths[i] - colPadding * 2 * scale,
            });
          }
          x += scaledWidths[i];
        }
      };

      drawRow(rows[0], true, y);
      y -= rowHeight;

      for (let r = 1; r < rows.length; r++) {
        if (y < margin + rowHeight) {
          const newPage = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin - headerHeight;
        }
        drawRow(rows[r], false, y);
        y -= rowHeight;
      }
    }

    const pdfBytes = await doc.save();
    const baseName = file.name.replace(/\.(xlsx|xls)$/i, '') || 'excel';
    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(pdfBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(`${baseName}.pdf`)}`,
      fileName: `${baseName}.pdf`,
      sizeBytes: pdfBytes.length,
    });
  } catch (err) {
    console.error('Excel to PDF error:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: `Gagal mengonversi Excel ke PDF: ${message}` }, { status: 500 });
  }
}
