'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToolState } from '@/hooks/useToolState';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { validateFile } from '@/lib/validators/file-validator';

interface PdfToTextResult {
  text: string;
  pageCount: number;
}

export default function PdfToTextWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, PdfToTextResult>();
  const [file, setFile] = useState<File | null>(null);
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

  async function handleExtract() {
    if (!file) {
      toast.warning('Pilih file PDF terlebih dahulu.');
      return;
    }

    setProcessing();
    toast.info('Mengekstrak teks dari PDF...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/pdf/to-text', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal mengekstrak teks.');
      }

      const data: PdfToTextResult = await res.json();
      setSuccess(data);
      toast.success('Teks berhasil diekstrak!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleCopy() {
    if (state.result?.text) {
      navigator.clipboard.writeText(state.result.text).then(() => {
        toast.success('Teks disalin ke clipboard!');
      }).catch(() => {
        toast.error('Gagal menyalin teks.');
      });
    }
  }

  function handleReset() {
    setFile(null);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Mengekstrak teks dari PDF..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
          <p className="text-sm font-medium text-green-700">
            Teks berhasil diekstrak! ({state.result.pageCount} halaman)
          </p>
        </div>
        <textarea
          readOnly
          value={state.result.text}
          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none resize-y min-h-[300px] font-mono"
        />
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="primary">
            Salin Teks
          </Button>
          <Button onClick={handleReset} variant="secondary">
            Extract PDF Lain
          </Button>
        </div>
      </div>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={handleRemoveFile} className="ml-3 text-sm text-red-500 hover:underline">Hapus</button>
          </div>
          <Button onClick={handleExtract} variant="primary" fullWidth>
            Extract Teks
          </Button>
        </div>
      )}
    </div>
  );
}
