import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib-with-encrypt';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 60;

const TEMP_DIR = process.env.TEMP_STORAGE_PATH ?? path.join(process.cwd(), 'tmp');

async function createZip(files: { name: string; buffer: Buffer }[]): Promise<Buffer> {
  const { deflateSync } = await import('zlib');
  const localHeaders: Buffer[] = [];
  const centralEntries: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf-8');
    const compressed = deflateSync(file.buffer);
    const crc = crc32(file.buffer);

    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(file.buffer.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuf.copy(localHeader, 30);

    localHeaders.push(Buffer.concat([localHeader, compressed]));

    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(file.buffer.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuf.copy(centralHeader, 46);

    centralEntries.push(centralHeader);
    offset += 30 + nameBuf.length + compressed.length;
  }

  const centralDir = Buffer.concat(centralEntries);
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0);
  endRecord.writeUInt16LE(0, 4);
  endRecord.writeUInt16LE(0, 6);
  endRecord.writeUInt16LE(files.length, 8);
  endRecord.writeUInt16LE(files.length, 10);
  endRecord.writeUInt32LE(centralDir.length, 12);
  endRecord.writeUInt32LE(offset, 16);
  endRecord.writeUInt16LE(0, 20);

  return Buffer.concat([...localHeaders, centralDir, endRecord]);
}

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export async function POST(req: NextRequest) {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const scale = parseInt(formData.get('scale') as string) || 150;

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    const imageBuffers: { name: string; buffer: Buffer }[] = [];
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(buffer);
    const allText = pdfData.text || '';
    const lines = allText.split('\n').filter((l: string) => l.trim());

    const dpi = scale;
    const width = Math.round(8.27 * dpi);
    const height = Math.round(11.69 * dpi);
    const perPageLines = Math.floor((height - 80) / 18);

    for (let p = 0; p < totalPages; p++) {
      const pageLines = lines.slice(p * perPageLines, (p + 1) * perPageLines);
      const svgLines = pageLines.map((line: string, i: number) =>
        `<text x="40" y="${60 + i * 18}" font-size="12" font-family="Arial, sans-serif" fill="#333">${escapeXml(line.slice(0, 100))}</text>`
      ).join('\n');
      const footer = `<text x="40" y="${height - 20}" font-size="10" font-family="Arial, sans-serif" fill="#999">Page ${p + 1} of ${totalPages}</text>`;
      const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        ${svgLines}
        ${footer}
      </svg>`;

      const jpgBuffer = await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer();
      imageBuffers.push({ name: `page-${p + 1}.jpg`, buffer: jpgBuffer });
    }

    if (imageBuffers.length === 0) {
      const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <text x="${width / 2}" y="${height / 2}" font-size="18" font-family="Arial, sans-serif" fill="#999" text-anchor="middle">No content found</text>
      </svg>`;
      const jpgBuffer = await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer();
      imageBuffers.push({ name: 'page-1.jpg', buffer: jpgBuffer });
    }

    const zipBuffer = await createZip(imageBuffers);
    const baseName = file.name.replace(/\.pdf$/i, '') || 'pdf';
    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, zipBuffer);

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=${encodeURIComponent(`${baseName}-pages.zip`)}`,
      fileName: `${baseName}-pages.zip`,
      sizeBytes: zipBuffer.length,
      pageCount: totalPages,
    });
  } catch (err) {
    console.error('PDF to JPG error:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: `Gagal mengonversi PDF: ${message}` }, { status: 500 });
  }
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
