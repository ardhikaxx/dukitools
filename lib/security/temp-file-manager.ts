import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const TEMP_DIR = process.env.TEMP_STORAGE_PATH ?? '/tmp/dukitools';
const TTL_MS = Number(process.env.TEMP_FILE_TTL_MINUTES ?? 15) * 60 * 1000;

interface TempFileRecord {
  id: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  createdAt: number;
}

const registry = new Map<string, TempFileRecord>();

export async function saveTempFile(buffer: Buffer, fileName: string, mimeType: string) {
  const id = crypto.randomUUID();
  const filePath = path.join(TEMP_DIR, id);
  await writeFile(filePath, buffer);

  registry.set(id, { id, filePath, fileName, mimeType, createdAt: Date.now() });

  setTimeout(() => deleteTempFile(id), TTL_MS);

  return { downloadUrl: `/api/download/${id}`, fileName, id };
}

export async function deleteTempFile(id: string) {
  const record = registry.get(id);
  if (!record) return;
  try {
    await unlink(record.filePath);
  } catch {
    /* file mungkin sudah terhapus */
  }
  registry.delete(id);
}

export function getTempFile(id: string) {
  return registry.get(id);
}
