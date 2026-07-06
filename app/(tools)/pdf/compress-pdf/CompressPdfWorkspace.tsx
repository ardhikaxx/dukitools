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

interface CompressResult {
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
  originalSizeBytes: number;
}

export default function CompressPdfWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, CompressResult>();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const toast = useToast();

  function handleFilesAdded(files: File[]) {
    const f = files[0];
    if (!f) return;
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

  function handleRemoveFile() {
    setFile(null);
  }

  async function handleCompress() {
    if (!file) {
      toast.warning('Pilih file PDF terlebih dahulu.');
      return;
    }

    setProcessing();
    toast.info('File sedang dikompres...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', quality.toString());

      const res = await fetch('/api/pdf/compress', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal mengompres file.');
      }

      const data: CompressResult = await res.json();
      setSuccess(data);
      toast.success('File berhasil dikompres!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFile(null);
    setQuality(70);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Mengompres file PDF..." />;
  }

  if (state.status === 'success' && state.result) {
    const savingsPercent = ((state.result.originalSizeBytes - state.result.sizeBytes) / state.result.originalSizeBytes * 100).toFixed(1);
    return (
      <ResultCard
        title="PDF Berhasil Dikompres"
        downloadUrl={state.result.downloadUrl}
        fileName={state.result.fileName}
        sizeInfo={`Ukuran awal: ${(state.result.originalSizeBytes / 1024 / 1024).toFixed(2)} MB → ${(state.result.sizeBytes / 1024 / 1024).toFixed(2)} MB (hemat ${savingsPercent}%)`}
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
          onFilesSelected={handleFilesAdded}
          accept={tool.acceptedFileTypes?.join(',')}
          label="Seret & letakkan file PDF di sini, atau klik untuk memilih"
        />
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-800">{file.name}</p>
            <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={handleRemoveFile} className="ml-3 text-sm text-red-500 hover:underline">Hapus</button>
        </div>
      )}
      {file && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Kualitas kompresi: {quality}%</label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Kompresi tinggi</span>
              <span>Kualitas tinggi</span>
            </div>
          </div>
          <Button onClick={handleCompress} variant="primary" fullWidth>Kompres PDF</Button>
        </>
      )}
    </div>
  );
}
