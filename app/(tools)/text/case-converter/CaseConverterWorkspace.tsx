'use client';

import { useState, useCallback } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';

type CaseMode =
  | 'uppercase' | 'lowercase' | 'title' | 'camel' | 'pascal'
  | 'snake' | 'kebab';

interface ModeDef {
  key: CaseMode;
  label: string;
}

const MODES: ModeDef[] = [
  { key: 'uppercase', label: 'UPPERCASE' },
  { key: 'lowercase', label: 'lowercase' },
  { key: 'title', label: 'Title Case' },
  { key: 'camel', label: 'camelCase' },
  { key: 'pascal', label: 'PascalCase' },
  { key: 'snake', label: 'SNAKE_CASE' },
  { key: 'kebab', label: 'kebab-case' },
];

function convertText(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
    case 'camel':
      return text
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
    case 'pascal':
      return text
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[a-z]/, (c) => c.toUpperCase());
    case 'snake':
      return text
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toUpperCase();
    case 'kebab':
      return text
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase();
  }
}

export default function CaseConverterWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const toast = useToast();

  const handleConvert = useCallback(
    (mode: CaseMode) => {
      if (!text.trim()) {
        toast.warning('Masukkan teks terlebih dahulu.');
        return;
      }
      const result = convertText(text, mode);
      setOutput(result);
      toast.success(`Teks dikonversi ke ${mode}!`);
    },
    [text, toast]
  );

  function handleReset() {
    setText('');
    setOutput('');
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setOutput(''); }}
        placeholder="Ketik atau tempel teks di sini..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[150px]"
        rows={6}
      />

      <div className="flex flex-wrap gap-2">
        {MODES.map((mode) => (
          <button
            key={mode.key}
            onClick={() => handleConvert(mode.key)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            {mode.label}
          </button>
        ))}
      </div>

      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Hasil</label>
          <pre className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm whitespace-pre-wrap">{output}</pre>
          <div className="mt-3">
            <ToolActions textResult={output} onReset={handleReset} />
          </div>
        </div>
      )}
    </div>
  );
}
