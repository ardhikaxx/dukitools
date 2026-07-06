import { useState, useCallback } from 'react';

interface UseFileUploadOptions {
  accept?: string[];
  maxSizeMB?: number;
  maxFiles?: number;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    setError(null);
    const max = options.maxFiles ?? 1;
    if (files.length + newFiles.length > max) {
      setError(`Maksimal ${max} file.`);
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
  }, [files.length, options.maxFiles]);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reorderFiles = useCallback((newOrder: File[]) => {
    setFiles(newOrder);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return { files, error, addFiles, removeFile, reorderFiles, clearFiles };
}
