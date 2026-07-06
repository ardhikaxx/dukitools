import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib-with-encrypt';
import sharp from 'sharp';
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
    const fileEntries = formData.getAll('files') as File[];

    if (!fileEntries.length) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'Tidak ada file gambar.' }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of fileEntries) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const jpegBuffer = await sharp(buffer).jpeg().toBuffer();
      const image = await pdfDoc.embedJpg(jpegBuffer);
      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await pdfDoc.save();
    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(pdfBytes));

    const baseName = fileEntries.length === 1
      ? fileEntries[0].name.replace(/\.\w+$/, '.pdf')
      : 'gabungan-gambar.pdf';

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(baseName)}`,
      fileName: baseName,
      sizeBytes: pdfBytes.length,
    });
  } catch (err) {
    console.error('JPG to PDF error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengonversi gambar ke PDF.' }, { status: 500 });
  }
}
