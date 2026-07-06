'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import Button from '@/components/ui/Button';

export default function UrlEncoderDecoderWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const toast = useToast();

  function handleEncode() {
    if (!input.trim()) {
      toast.warning('Masukkan teks terlebih dahulu.');
      return;
    }
    setOutput(encodeURIComponent(input));
    toast.success('Teks berhasil di-encode!');
  }

  function handleDecode() {
    if (!input.trim()) {
      toast.warning('Masukkan teks terlebih dahulu.');
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
      toast.success('Teks berhasil di-decode!');
    } catch {
      toast.error('String tidak valid untuk di-decode.');
    }
  }

  function handleReset() {
    setInput('');
    setOutput('');
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(''); }}
          placeholder="Tempel teks atau URL di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[120px]"
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleEncode}>Encode</Button>
        <Button variant="secondary" onClick={handleDecode}>Decode</Button>
      </div>

      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Result</label>
          <textarea
            value={output}
            readOnly
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-800 outline-none resize-y min-h-[80px]"
            rows={3}
          />
        </div>
      )}

      <ToolActions textResult={output || undefined} onReset={handleReset} />
    </div>
  );
}
