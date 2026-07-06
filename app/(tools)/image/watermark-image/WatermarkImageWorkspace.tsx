'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToolState } from '@/hooks/useToolState';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ResultCard from '@/components/ui/ResultCard';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { validateFile } from '@/lib/validators/file-validator';

interface WatermarkResult {
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
}

const POSITIONS = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'center', label: 'Center' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

export default function WatermarkImageWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File, WatermarkResult>();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [position, setPosition] = useState('bottom-right');
  const [opacity, setOpacity] = useState(50);
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

  async function handleWatermark() {
    if (!file) {
      toast.warning('Pilih file gambar terlebih dahulu.');
      return;
    }
    if (!text.trim()) {
      toast.warning('Masukkan teks watermark.');
      return;
    }

    setProcessing();
    toast.info('Menambahkan watermark...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('text', text);
      formData.append('position', position);
      formData.append('opacity', String(opacity));

      const res = await fetch('/api/image/watermark', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal menambahkan watermark.');
      }

      const data: WatermarkResult = await res.json();
      setSuccess(data);
      toast.success('Watermark berhasil ditambahkan!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFile(null);
    setText('');
    setPosition('bottom-right');
    setOpacity(50);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Menambahkan watermark..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <ResultCard
        title="Watermark Berhasil Ditambahkan"
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

          <Input
            label="Teks Watermark"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan teks watermark..."
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Posisi</label>
            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    position === p.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Opacity: {opacity}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Transparan</span>
              <span>Solid</span>
            </div>
          </div>

          <Button onClick={handleWatermark} variant="primary" fullWidth>
            Tambah Watermark
          </Button>
        </div>
      )}
    </div>
  );
}
