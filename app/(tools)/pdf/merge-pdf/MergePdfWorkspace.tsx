'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToolState } from '@/hooks/useToolState';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import FileListPreview from '@/components/ui/FileListPreview';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ResultCard from '@/components/ui/ResultCard';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { validateFile } from '@/lib/validators/file-validator';

interface MergeResult {
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
}

export default function MergePdfWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File[], MergeResult>();
  const [files, setFiles] = useState<File[]>([]);
  const toast = useToast();

  function handleFilesAdded(newFiles: File[]) {
    const combined = [...files, ...newFiles];
    if (combined.length > (tool.maxFiles ?? 20)) {
      toast.warning(`Maksimal ${tool.maxFiles} file untuk tool ini.`);
      return;
    }
    for (const f of newFiles) {
      const validation = validateFile(f, {
        allowedExtensions: tool.acceptedFileTypes ?? [],
        allowedTypes: tool.acceptedMimeTypes ?? [],
        maxSizeBytes: (tool.maxFileSizeMB ?? 25) * 1024 * 1024,
      });
      if (!validation.valid) {
        toast.error(validation.error!);
        return;
      }
    }
    setFiles(combined);
  }

  function handleRemoveFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleReorder(newOrder: File[]) {
    setFiles(newOrder);
  }

  async function handleMerge() {
    if (files.length < 2) {
      toast.warning('Pilih minimal 2 file PDF untuk digabungkan.');
      return;
    }

    setProcessing();
    toast.info('File sedang digabungkan...');

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/pdf/merge', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal menggabungkan file.');
      }

      const data: MergeResult = await res.json();
      setSuccess(data);
      toast.success('File berhasil digabungkan!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFiles([]);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Menggabungkan file PDF..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <ResultCard
        title="PDF Berhasil Digabungkan"
        downloadUrl={state.result.downloadUrl}
        fileName={state.result.fileName}
        sizeInfo={`Ukuran hasil: ${(state.result.sizeBytes / 1024 / 1024).toFixed(2)} MB`}
        onReset={handleReset}
      />
    );
  }

  if (state.status === 'error') {
    return <ErrorState message={state.errorMessage ?? 'Terjadi kesalahan.'} onRetry={handleReset} />;
  }

  return (
    <div className="space-y-4">
      <FileUpload
        onFilesSelected={handleFilesAdded}
        accept={tool.acceptedFileTypes?.join(',')}
        multiple
        label="Seret & letakkan file PDF di sini, atau klik untuk memilih"
      />
      {files.length > 0 && (
        <>
          <FileListPreview files={files} onRemove={handleRemoveFile} onReorder={handleReorder} />
          <Button onClick={handleMerge} variant="primary" fullWidth>
            Gabungkan {files.length} File PDF
          </Button>
        </>
      )}
    </div>
  );
}
