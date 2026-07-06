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

interface ResizeResult {
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
}

export default function ResizeImageWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, ResizeResult>();
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspect, setMaintainAspect] = useState(true);
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

  async function handleResize() {
    if (!file) {
      toast.warning('Pilih file gambar terlebih dahulu.');
      return;
    }
    if (!width || !height) {
      toast.warning('Masukkan lebar dan tinggi.');
      return;
    }

    setProcessing();
    toast.info('Sedang mengubah ukuran gambar...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('width', width);
      formData.append('height', height);
      formData.append('maintainAspect', String(maintainAspect));

      const res = await fetch('/api/image/resize', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal mengubah ukuran gambar.');
      }

      const data: ResizeResult = await res.json();
      setSuccess(data);
      toast.success('Ukuran gambar berhasil diubah!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFile(null);
    setWidth('');
    setHeight('');
    setMaintainAspect(true);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Mengubah ukuran gambar..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <ResultCard
        title="Ukuran Gambar Berhasil Diubah"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Lebar (px)</label>
              <input
                type="number"
                min={1}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g. 800"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tinggi (px)</label>
              <input
                type="number"
                min={1}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 600"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={maintainAspect}
              onChange={(e) => setMaintainAspect(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Pertahankan aspek rasio
          </label>

          <Button onClick={handleResize} variant="primary" fullWidth>
            Resize Image
          </Button>
        </div>
      )}
    </div>
  );
}
