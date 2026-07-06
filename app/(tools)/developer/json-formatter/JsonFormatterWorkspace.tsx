'use client';

import { useState, useCallback } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ResultCard from '@/components/ui/ResultCard';
import ErrorState from '@/components/ui/ErrorState';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Braces, Minus, Maximize2 } from 'lucide-react';

export default function JsonFormatterWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const formatJson = useCallback(() => {
    if (!input.trim()) {
      toast.warning('Masukkan JSON terlebih dahulu.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
      toast.success('JSON berhasil diformat!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'JSON tidak valid.';
      setError(message);
      toast.error(message);
    }
  }, [input, toast]);

  const minifyJson = useCallback(() => {
    if (!input.trim()) {
      toast.warning('Masukkan JSON terlebih dahulu.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
      toast.success('JSON berhasil diminify!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'JSON tidak valid.';
      setError(message);
      toast.error(message);
    }
  }, [input, toast]);

  function handleReset() {
    setInput('');
    setOutput('');
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input JSON</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder="Tempel (paste) kode JSON Anda di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={8}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={formatJson}>
          <Maximize2 size={16} className="mr-1.5" /> Format (Beautify)
        </Button>
        <Button variant="secondary" onClick={minifyJson}>
          <Minus size={16} className="mr-1.5" /> Minify
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {output && (
        <ResultCard
          title="Hasil JSON"
          textResult={output}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
