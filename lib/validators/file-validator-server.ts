import { detectFileSignature } from '@/lib/security/magic-bytes';

export function validateFileServerSide(
  buffer: Buffer,
  expectedType: string,
  maxSizeBytes: number
): { valid: boolean; error?: string; code?: string } {
  if (buffer.length === 0) return { valid: false, error: 'File kosong.', code: 'FILE_EMPTY' };
  if (buffer.length > maxSizeBytes) return { valid: false, error: 'Ukuran file melebihi batas.', code: 'FILE_TOO_LARGE' };

  const detected = detectFileSignature(buffer);
  if (detected !== expectedType) {
    return { valid: false, error: 'Isi file tidak sesuai dengan format yang diharapkan.', code: 'INVALID_FILE_TYPE' };
  }
  return { valid: true };
}
