'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import Button from '@/components/ui/Button';

type ReverseMode = 'chars' | 'words' | 'lines';

export default function TextReverserWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const toast = useToast();

  function handleReverse(mode: ReverseMode) {
    if (!text.trim()) {
      toast.warning('Masukkan teks terlebih dahulu.');
      return;
    }
    let result = '';
    switch (mode) {
      case 'chars':
        result = text.split('').reverse().join('');
        break;
      case 'words':
        result = text.split(/\s+/).reverse().join(' ');
        break;
      case 'lines':
        result = text.split('\n').reverse().join('\n');
        break;
    }
    setOutput(result);
    toast.success('Teks berhasil dibalik!');
  }

  function handleReset() {
    setText('');
    setOutput(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input Text</label>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setOutput(null); }}
          placeholder="Ketik atau tempel teks di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={6}
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => handleReverse('chars')}>Reverse Characters</Button>
        <Button variant="secondary" onClick={() => handleReverse('words')}>Reverse Words</Button>
        <Button variant="secondary" onClick={() => handleReverse('lines')}>Reverse Lines</Button>
      </div>

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
