'use client';

import { useState, useRef, useCallback } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ResultCard from '@/components/ui/ResultCard';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { FileUp, Play, Upload } from 'lucide-react';

export default function Base64EncoderDecoderWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  function encode(str: string): string {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      throw new Error('Encode gagal: teks tidak valid.');
    }
  }

  function decode(str: string): string {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch {
      throw new Error('Decode gagal: pastikan input adalah Base64 yang valid.');
    }
  }

  function handleExecute() {
    setOutput('');
    setError(null);
    const trimmed = input.trim();
    if (!trimmed && !fileName) {
      toast.warning('Masukkan teks atau file terlebih dahulu.');
      return;
    }
    try {
      const result = mode === 'encode' ? encode(trimmed) : decode(trimmed);
      setOutput(result);
      toast.success(`${mode === 'encode' ? 'Encode' : 'Decode'} berhasil!`);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Operasi gagal.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setInput('');
    setOutput('');
    setError(null);
    setFileName(null);
  }

  function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (mode !== 'encode') {
      toast.warning('Drag-drop hanya tersedia untuk mode Encode.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const content = base64.split(',')[1];
      setInput(content);
      setFileName(file.name);
      toast.success(`File "${file.name}" berhasil dimuat.`);
    };
    reader.onerror = () => toast.error('Gagal membaca file.');
    reader.readAsDataURL(file);
  }

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => e.preventDefault(), []);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            checked={mode === 'encode'}
            onChange={() => { setMode('encode'); setError(null); setFileName(null); }}
            className="text-indigo-600"
          />
          <span className="text-sm font-medium text-slate-700">Encode</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            checked={mode === 'decode'}
            onChange={() => { setMode('decode'); setError(null); setFileName(null); }}
            className="text-indigo-600"
          />
          <span className="text-sm font-medium text-slate-700">Decode</span>
        </label>
      </div>

      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-slate-700">
          {mode === 'encode' ? 'Teks atau File' : 'Base64 String'}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder={mode === 'encode' ? 'Tempel teks atau drag-drop file di sini...' : 'Tempel Base64 string di sini...'}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[150px]"
          rows={6}
        />
        {mode === 'encode' && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Upload size={14} />
            <span>Drag-drop file untuk encode, atau </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              pilih file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = reader.result as string;
                  setInput(base64.split(',')[1]);
                  setFileName(file.name);
                  toast.success(`File "${file.name}" berhasil dimuat.`);
                };
                reader.onerror = () => toast.error('Gagal membaca file.');
                reader.readAsDataURL(file);
              }}
            />
            {fileName && <span className="text-indigo-600">{fileName}</span>}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleExecute}>
          <Play size={16} className="mr-1.5" /> {mode === 'encode' ? 'Encode' : 'Decode'}
        </Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {output && (
        <ResultCard
          title={`Hasil ${mode === 'encode' ? 'Encode' : 'Decode'}`}
          textResult={output}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
