'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';

function escapeCsv(val: unknown): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function JsonToCsvWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function handleConvert() {
    if (!input.trim()) {
      toast.warning('Masukkan JSON terlebih dahulu.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('JSON harus berupa array of objects.');
      }
      const keys = [...new Set(parsed.flatMap((obj) => Object.keys(obj)))];
      const header = keys.join(',');
      const rows = parsed.map((obj) => keys.map((k) => escapeCsv(obj[k])).join(','));
      setOutput([header, ...rows].join('\n'));
      setError(null);
      toast.success('JSON berhasil dikonversi ke CSV!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'JSON tidak valid.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setInput('');
    setOutput('');
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input JSON (array of objects)</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder='[{&quot;name&quot;: &quot;John&quot;, &quot;age&quot;: 30}]'
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={6}
        />
      </div>

      <Button onClick={handleConvert} fullWidth>Convert to CSV</Button>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">CSV Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-800 outline-none resize-y min-h-[120px]"
            rows={4}
          />
        </div>
      )}

      <ToolActions textResult={output || undefined} onReset={handleReset} />
    </div>
  );
}
