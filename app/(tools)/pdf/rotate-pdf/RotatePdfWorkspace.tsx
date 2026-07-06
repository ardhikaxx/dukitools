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

interface RotateResult {
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
}

const ANGLES = [90, 180, 270];

export default function RotatePdfWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, RotateResult>();
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
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

  async function handleRotate() {
    if (!file) {
      toast.warning('Pilih file PDF terlebih dahulu.');
      return;
    }

    setProcessing();
    toast.info('File sedang diputar...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('angle', angle.toString());

      const res = await fetch('/api/pdf/rotate', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal memutar file.');
      }

      const data: RotateResult = await res.json();
      setSuccess(data);
      toast.success('File berhasil diputar!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFile(null);
    setAngle(90);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Memutar halaman PDF..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <ResultCard
        title="PDF Berhasil Diputar"
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Sudut rotasi</label>
            <div className="flex gap-2">
              {ANGLES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAngle(a)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    angle === a
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleRotate} variant="primary" fullWidth>Putar PDF</Button>
        </>
      )}
    </div>
  );
}
