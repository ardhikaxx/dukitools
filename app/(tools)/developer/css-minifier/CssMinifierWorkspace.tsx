'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import Button from '@/components/ui/Button';

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .trim();
}

export default function CssMinifierWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const toast = useToast();

  function handleMinify() {
    if (!input.trim()) {
      toast.warning('Masukkan CSS terlebih dahulu.');
      return;
    }
    const result = minifyCss(input);
    setOutput(result);
    toast.success('CSS berhasil diminify!');
  }

  function handleReset() {
    setInput('');
    setOutput('');
  }

  const inputSize = new Blob([input]).size;
  const outputSize = output ? new Blob([output]).size : 0;
  const saved = inputSize - outputSize;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input CSS</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(''); }}
          placeholder="body { margin: 0; padding: 0; }"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={6}
        />
      </div>

      {input && <p className="text-xs text-slate-500">Size: {inputSize} bytes</p>}

      <Button onClick={handleMinify} fullWidth>Minify</Button>

      {output && (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="block text-sm font-medium text-slate-700">Minified CSS</label>
            <span className="text-xs text-emerald-600">Before: {inputSize}B → After: {outputSize}B ({saved > 0 ? '-' : ''}{saved}B)</span>
          </div>
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
