'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = false;
      } else current += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { result.push(current.trim()); current = ''; }
      else current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export default function CsvToJsonWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function handleConvert() {
    if (!input.trim()) {
      toast.warning('Masukkan CSV terlebih dahulu.');
      return;
    }
    try {
      const lines = input.split('\n').filter((l) => l.trim());
      if (lines.length < 2) throw new Error('CSV harus memiliki header dan setidaknya satu baris data.');
      const headers = parseCsvLine(lines[0]);
      const result = lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });
        return obj;
      });
      setOutput(JSON.stringify(result, null, 2));
      setError(null);
      toast.success('CSV berhasil dikonversi ke JSON!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'CSV tidak valid.';
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
        <label className="mb-2 block text-sm font-medium text-slate-700">Input CSV</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder="name,age&#10;John,30&#10;Jane,25"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={6}
        />
      </div>

      <Button onClick={handleConvert} fullWidth>Convert to JSON</Button>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">JSON Output</label>
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
