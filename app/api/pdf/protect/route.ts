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
    const password = formData.get('password') as string || '';

    if (!file) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
    }
    if (!password || password.length < 3) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'Password minimal 3 karakter.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    await doc.encrypt({ userPassword: password, ownerPassword: password });
    const protectedBytes = await doc.save();

    const id = crypto.randomUUID();
    const filePath = path.join(TEMP_DIR, id);
    await writeFile(filePath, Buffer.from(protectedBytes));

    return NextResponse.json({
      downloadUrl: `/api/download/${id}?filename=protected.pdf`,
      fileName: 'protected.pdf',
      sizeBytes: protectedBytes.length,
    });
  } catch (err) {
    console.error('Protect PDF error:', err);
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal memberi proteksi pada file PDF.' }, { status: 500 });
  }
}
