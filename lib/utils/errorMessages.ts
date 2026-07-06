export const ERROR_MESSAGES: Record<string, string> = {
  FILE_EMPTY: 'File kosong tidak dapat diproses.',
  FILE_TOO_LARGE: 'Ukuran file melebihi batas maksimum yang diizinkan.',
  INVALID_FILE_TYPE: 'Format file tidak didukung.',
  TOO_MANY_FILES: 'Jumlah file melebihi batas maksimum.',
  CORRUPT_FILE: 'File rusak atau tidak dapat dibaca.',
  SERVER_BUSY: 'Server sedang sibuk. Silakan coba beberapa saat lagi.',
  NETWORK_ERROR: 'Koneksi terputus. Periksa jaringan Anda.',
  PROCESSING_FAILED: 'Terjadi kesalahan saat memproses file.',
  RATE_LIMITED: 'Terlalu banyak permintaan. Silakan tunggu sebentar.',
};

export function resolveErrorMessage(code?: string, fallback = 'Terjadi kesalahan tidak terduga.'): string {
  if (!code) return fallback;
  return ERROR_MESSAGES[code] ?? fallback;
}
