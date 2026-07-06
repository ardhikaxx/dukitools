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
  originalSizeBytes: number;
  compressedSizeBytes: number;
}

export default function CompressImageWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, CompressResult>();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
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
      toast.warning('Pilih file gambar terlebih dahulu.');
      return;
    }

    setProcessing();
    toast.info('Sedang mengompres gambar...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', String(quality));

      const res = await fetch('/api/image/compress', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal mengompres gambar.');
      }

      const data: CompressResult = await res.json();
      setSuccess(data);
      toast.success('Gambar berhasil dikompres!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFile(null);
    setQuality(80);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Mengompres gambar..." />;
  }

  if (state.status === 'success' && state.result) {
    const savingsPercent = ((1 - state.result.compressedSizeBytes / state.result.originalSizeBytes) * 100).toFixed(1);
    return (
      <ResultCard
        title="Gambar Berhasil Dikompres"
        downloadUrl={state.result.downloadUrl}
        fileName={state.result.fileName}
        sizeInfo={`Ukuran awal: ${(state.result.originalSizeBytes / 1024).toFixed(1)} KB → ${(state.result.compressedSizeBytes / 1024).toFixed(1)} KB (hemat ${savingsPercent}%)`}
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
          label="Seret & letakkan gambar di sini, atau klik untuk memilih"
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            <button onClick={handleRemoveFile} className="mt-1 text-xs text-red-500 hover:underline">Hapus</button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Kualitas: {quality}
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Kecil</span>
              <span>Original</span>
            </div>
          </div>

          <Button onClick={handleCompress} variant="primary" fullWidth>
            Compress Image
          </Button>
        </div>
      )}
    </div>
  );
}
