'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import Button from '@/components/ui/Button';

interface Options {
  trim: boolean;
  extraSpaces: boolean;
  allSpaces: boolean;
  blankLines: boolean;
}

export default function WhitespaceRemoverWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [options, setOptions] = useState<Options>({
    trim: true,
    extraSpaces: false,
    allSpaces: false,
    blankLines: false,
  });
  const toast = useToast();

  function toggleOption(key: keyof Options) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    setOutput(null);
  }

  function handleClean() {
    if (!text.trim()) {
      toast.warning('Masukkan teks terlebih dahulu.');
      return;
    }
    let result = text;
    if (options.allSpaces) {
      result = result.replace(/\s+/g, '');
    } else {
      if (options.trim) {
        result = result.split('\n').map((l) => l.trim()).join('\n');
      }
      if (options.extraSpaces) {
        result = result.replace(/[ \t]+/g, ' ');
      }
    }
    if (options.blankLines) {
      result = result.split('\n').filter((l) => l.trim()).join('\n');
    }
    setOutput(result);
    toast.success('Whitespace berhasil dibersihkan!');
  }

  function handleReset() {
    setText('');
    setOutput(null);
  }

  const checkboxes: { key: keyof Options; label: string }[] = [
    { key: 'trim', label: 'Trim leading/trailing' },
    { key: 'extraSpaces', label: 'Remove extra spaces' },
    { key: 'allSpaces', label: 'Remove all spaces' },
    { key: 'blankLines', label: 'Remove blank lines' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input Text</label>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setOutput(null); }}
          placeholder="Tempel teks yang akan dibersihkan di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        {checkboxes.map((cb) => (
          <label key={cb.key} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={options[cb.key]}
              onChange={() => toggleOption(cb.key)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            {cb.label}
          </label>
        ))}
      </div>

      <Button onClick={handleClean} fullWidth>Clean Text</Button>

      {output !== null && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Result</label>
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
