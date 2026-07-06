export interface FileValidationRule {
  allowedTypes: string[];
  allowedExtensions: string[];
  maxSizeBytes: number;
  minSizeBytes?: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

export function validateFile(file: File, rule: FileValidationRule): ValidationResult {
  if (!file || file.size === 0) {
    return { valid: false, error: 'File kosong atau tidak valid.', code: 'FILE_EMPTY' };
  }
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
  if (rule.allowedExtensions.length && !rule.allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Format file tidak didukung. Gunakan format: ${rule.allowedExtensions.join(', ')}`,
      code: 'INVALID_FILE_TYPE',
    };
  }
  if (file.size > rule.maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimum ${Math.round(rule.maxSizeBytes / 1024 / 1024)}MB.`,
      code: 'FILE_TOO_LARGE',
    };
  }
  return { valid: true };
}
