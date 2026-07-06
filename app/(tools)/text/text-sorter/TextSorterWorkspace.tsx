'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import Button from '@/components/ui/Button';

type SortOrder = 'asc' | 'desc';

export default function TextSorterWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [order, setOrder] = useState<SortOrder>('asc');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const toast = useToast();

  function handleSort() {
    if (!text.trim()) {
      toast.warning('Masukkan teks terlebih dahulu.');
      return;
    }
    const lines = text.split('\n');
    const sorted = [...lines].sort((a, b) => {
      const aVal = ignoreCase ? a.toLowerCase() : a;
      const bVal = ignoreCase ? b.toLowerCase() : b;
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setOutput(sorted.join('\n'));
    toast.success('Teks berhasil diurutkan!');
  }

  function handleReset() {
    setText('');
    setOutput(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input Text (one item per line)</label>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setOutput(null); }}
          placeholder="Tempel teks (satu item per baris)..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={6}
        />
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <Button variant={order === 'asc' ? 'primary' : 'secondary'} onClick={() => setOrder('asc')}>A-Z</Button>
        <Button variant={order === 'desc' ? 'primary' : 'secondary'} onClick={() => setOrder('desc')}>Z-A</Button>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer ml-2">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Ignore case
        </label>
      </div>

      <Button onClick={handleSort} fullWidth>Sort</Button>

      {output !== null && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Sorted Result</label>
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
