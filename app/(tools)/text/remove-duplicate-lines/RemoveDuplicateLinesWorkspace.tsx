'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import Button from '@/components/ui/Button';

export default function RemoveDuplicateLinesWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [originalCount, setOriginalCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const toast = useToast();

  function handleRemove() {
    if (!text.trim()) {
      toast.warning('Masukkan teks terlebih dahulu.');
      return;
    }
    const lines = text.split('\n');
    const original = lines.length;
    const unique = [...new Set(lines)];
    setOutput(unique.join('\n'));
    setOriginalCount(original);
    setNewCount(unique.length);
    toast.success('Baris duplikat berhasil dihapus!');
  }

  function handleReset() {
    setText('');
    setOutput(null);
    setOriginalCount(0);
    setNewCount(0);
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setOutput(null); }}
        placeholder="Tempel teks dengan baris duplikat di sini..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
        rows={8}
      />

      <Button onClick={handleRemove} variant="primary" fullWidth>
        Remove Duplicates
      </Button>

      {output !== null && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex gap-4 text-sm">
            <span className="text-slate-600">Baris awal: <strong>{originalCount}</strong></span>
            <span className="text-slate-600">Baris baru: <strong>{newCount}</strong></span>
            <span className="text-emerald-600">
              Berkurang: <strong>{originalCount - newCount}</strong> baris
            </span>
          </div>
          <pre className="max-h-48 overflow-auto rounded-lg bg-white p-4 text-sm whitespace-pre-wrap">{output}</pre>
          <div className="mt-3">
            <ToolActions textResult={output} onReset={handleReset} />
          </div>
        </div>
      )}
    </div>
  );
}
