'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToolState } from '@/hooks/useToolState';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ResultCard from '@/components/ui/ResultCard';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { validateFile } from '@/lib/validators/file-validator';

interface ConvertResult {
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
}

export default function PdfToPptWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, ConvertResult>();
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();

  function handleFilesSelected([f]: File[]) {
    const validation = validateFile(f, {
      allowedExtensions: tool.acceptedFileTypes ?? [],
      allowedTypes: tool.acceptedMimeTypes ?? [],
      maxSizeBytes: (tool.maxFileSizeMB ?? 25) * 1024 * 1024,
    });
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }
    setFile(f);
  }

  function handleRemove() {
    setFile(null);
  }

  async function handleConvert() {
    if (!file) {
      toast.warning('Pilih file PDF terlebih dahulu.');
      return;
    }

    setProcessing();
    toast.info('Mengonversi file...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetFormat', 'pptx');

      const res = await fetch('/api/pdf/convert', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal mengonversi file.');
      }

      const data: ConvertResult = await res.json();
      setSuccess(data);
      toast.success('File berhasil dikonversi!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFile(null);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Mengonversi file..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <ResultCard
        title="File Berhasil Dikonversi"
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
      {!file ? (
        <FileUpload
          onFilesSelected={handleFilesSelected}
          accept={tool.acceptedFileTypes?.join(',')}
          label="Seret & letakkan file PDF di sini, atau klik untuk memilih"
        />
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
          <span className="text-sm text-slate-700">{file.name}</span>
          <Button variant="ghost" onClick={handleRemove}>Hapus</Button>
        </div>
      )}
      {file && (
        <Button onClick={handleConvert} variant="primary" fullWidth>
          Konversi ke PPT
        </Button>
      )}
    </div>
  );
}
