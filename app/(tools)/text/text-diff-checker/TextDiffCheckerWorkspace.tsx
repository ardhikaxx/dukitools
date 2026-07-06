'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import Button from '@/components/ui/Button';

interface DiffLine {
  type: 'same' | 'added' | 'removed' | 'modified';
  original?: string;
  changed?: string;
  lineNum: number;
}

function computeDiff(original: string, changed: string): DiffLine[] {
  const origLines = original.split('\n');
  const changedLines = changed.split('\n');
  const maxLen = Math.max(origLines.length, changedLines.length);
  const result: DiffLine[] = [];

  for (let i = 0; i < maxLen; i++) {
    const o = origLines[i];
    const c = changedLines[i];
    if (o === undefined && c !== undefined) {
      result.push({ type: 'added', changed: c, lineNum: i + 1 });
    } else if (o !== undefined && c === undefined) {
      result.push({ type: 'removed', original: o, lineNum: i + 1 });
    } else if (o !== c) {
      result.push({ type: 'modified', original: o, changed: c, lineNum: i + 1 });
    } else {
      result.push({ type: 'same', original: o, changed: c, lineNum: i + 1 });
    }
  }
  return result;
}

export default function TextDiffCheckerWorkspace({ tool }: { tool: ToolConfig }) {
  const [original, setOriginal] = useState('');
  const [changed, setChanged] = useState('');
  const [diffs, setDiffs] = useState<DiffLine[] | null>(null);
  const toast = useToast();

  function handleCompare() {
    if (!original.trim() && !changed.trim()) {
      toast.warning('Masukkan teks untuk dibandingkan.');
      return;
    }
    const result = computeDiff(original, changed);
    setDiffs(result);
    const changes = result.filter((d) => d.type !== 'same').length;
    toast.success(`Selesai! ${changes} perbedaan ditemukan.`);
  }

  function handleReset() {
    setOriginal('');
    setChanged('');
    setDiffs(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Original</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Tempel teks versi asli di sini..."
            rows={8}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Changed</label>
          <textarea
            value={changed}
            onChange={(e) => setChanged(e.target.value)}
            placeholder="Tempel teks versi perubahan di sini..."
            rows={8}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleCompare} variant="primary" fullWidth>
          Compare
        </Button>
        <Button onClick={handleReset} variant="ghost">
          Reset
        </Button>
      </div>

      {diffs && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <span className="text-sm font-medium text-slate-700">Hasil Perbandingan</span>
          </div>
          <div className="divide-y divide-slate-100">
            {diffs.map((d) => (
              <div
                key={d.lineNum}
                className={`grid grid-cols-[40px_1fr] gap-0 text-sm ${
                  d.type === 'added' ? 'bg-green-50' :
                  d.type === 'removed' ? 'bg-red-50' :
                  d.type === 'modified' ? 'bg-amber-50' :
                  ''
                }`}
              >
                <div className="px-3 py-1 text-right text-xs text-slate-400 border-r border-slate-100 select-none">
                  {d.lineNum}
                </div>
                <div className="px-3 py-1 font-mono text-xs whitespace-pre-wrap">
                  {d.type === 'added' && (
                    <span className="text-green-700">+ {d.changed}</span>
                  )}
                  {d.type === 'removed' && (
                    <span className="text-red-700">- {d.original}</span>
                  )}
                  {d.type === 'modified' && (
                    <span className="text-amber-700">
                      <span className="line-through text-red-500">{d.original}</span>
                      {' → '}
                      <span className="text-green-600">{d.changed}</span>
                    </span>
                  )}
                  {d.type === 'same' && (
                    <span className="text-slate-600">{d.original}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
