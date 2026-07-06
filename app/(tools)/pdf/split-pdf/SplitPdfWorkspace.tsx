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

interface SplitResult {
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
}

export default function SplitPdfWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, SplitResult>();
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
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

  async function handleSplit() {
    if (!file) {
      toast.warning('Pilih file PDF terlebih dahulu.');
      return;
    }

    setProcessing();
    toast.info('File sedang diproses...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pageRange', pageRange);

      const res = await fetch('/api/pdf/split', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal memisahkan file.');
      }

      const data: SplitResult = await res.json();
      setSuccess(data);
      toast.success('File berhasil dipisahkan!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFile(null);
    setPageRange('');
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Memisahkan file PDF..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <ResultCard
        title="PDF Berhasil Dipisahkan"
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Halaman yang ingin dipisahkan</label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="Contoh: 1-3,5,7-9"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-400">Gunakan format: nomor halaman, rentang (pisahkan dengan koma)</p>
          </div>
          <Button onClick={handleSplit} variant="primary" fullWidth>Pisahkan PDF</Button>
        </>
      )}
    </div>
  );
}
