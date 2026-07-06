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

const FORMATS = ['PNG', 'JPG', 'WebP', 'HEIC'];

export default function ConvertImageWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, ConvertResult>();
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('PNG');
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

  async function handleConvert() {
    if (!file) {
      toast.warning('Pilih file gambar terlebih dahulu.');
      return;
    }

    setProcessing();
    toast.info('Sedang mengonversi gambar...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetFormat', targetFormat);

      const res = await fetch('/api/image/convert', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal mengonversi gambar.');
      }

      const data: ConvertResult = await res.json();
      setSuccess(data);
      toast.success('Gambar berhasil dikonversi!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFile(null);
    setTargetFormat('PNG');
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Mengonversi gambar..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <ResultCard
        title="Gambar Berhasil Dikonversi"
        downloadUrl={state.result.downloadUrl}
        fileName={state.result.fileName}
        sizeInfo={`Ukuran: ${(state.result.sizeBytes / 1024).toFixed(1)} KB`}
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
            <label className="mb-2 block text-sm font-medium text-slate-700">Target Format</label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>{fmt}</option>
              ))}
            </select>
          </div>

          <Button onClick={handleConvert} variant="primary" fullWidth>
            Convert to {targetFormat}
          </Button>
        </div>
      )}
    </div>
  );
}
