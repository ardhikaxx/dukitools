'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import Button from '@/components/ui/Button';
import ResultCard from '@/components/ui/ResultCard';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function JsonValidatorWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; error?: string; parsed?: unknown } | null>(null);
  const toast = useToast();

  function validate() {
    if (!input.trim()) {
      toast.warning('Masukkan JSON terlebih dahulu.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setResult({ valid: true, parsed });
      toast.success('JSON valid!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'JSON tidak valid.';
      setResult({ valid: false, error: message });
      toast.error(message);
    }
  }

  function handleReset() {
    setInput('');
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input JSON</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); }}
          placeholder="Tempel (paste) kode JSON Anda di sini untuk divalidasi..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={8}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={validate}>
          Validasi JSON
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result && (
        <div className={`rounded-xl border p-4 ${result.valid ? 'border-emerald-100 bg-emerald-50' : 'border-red-100 bg-red-50'}`}>
          <div className="flex items-center gap-2">
            {result.valid ? (
              <CheckCircle2 size={20} className="text-emerald-500" />
            ) : (
              <AlertCircle size={20} className="text-red-500" />
            )}
            <p className={`font-medium ${result.valid ? 'text-emerald-700' : 'text-red-700'}`}>
              {result.valid ? 'JSON Valid!' : 'JSON Tidak Valid'}
            </p>
          </div>
          {result.error && (
            <pre className="mt-2 whitespace-pre-wrap text-sm text-red-600 font-mono">{result.error}</pre>
          )}
          {result.valid && (
            <pre className="mt-3 max-h-60 overflow-auto rounded-lg bg-white p-3 text-sm font-mono">
              {JSON.stringify(result.parsed, null, 2)}
            </pre>
          )}
          <div className="mt-3">
            <Button variant="ghost" onClick={handleReset}>Reset</Button>
          </div>
        </div>
      )}
    </div>
  );
}
