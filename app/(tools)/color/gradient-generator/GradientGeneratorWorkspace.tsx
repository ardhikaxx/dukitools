'use client';

import { useState, useMemo } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

type Direction = 'to bottom' | 'to right' | 'to bottom right' | 'to bottom left';

const DIRECTION_OPTIONS: { label: string; value: Direction }[] = [
  { label: 'Atas ke Bawah', value: 'to bottom' },
  { label: 'Kiri ke Kanan', value: 'to right' },
  { label: 'Diagonal ↘', value: 'to bottom right' },
  { label: 'Diagonal ↙', value: 'to bottom left' },
];

export default function GradientGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#ec4899');
  const [direction, setDirection] = useState<Direction>('to bottom');
  const toast = useToast();

  const cssCode = useMemo(() => `background: linear-gradient(${direction}, ${color1}, ${color2});`, [color1, color2, direction]);

  async function handleCopy() {
    await navigator.clipboard.writeText(cssCode);
    toast.success('CSS berhasil disalin!');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Warna 1</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="h-12 w-full cursor-pointer rounded-lg border border-slate-200" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Warna 2</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="h-12 w-full cursor-pointer rounded-lg border border-slate-200" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Arah Gradien</label>
        <div className="flex gap-2 flex-wrap">
          {DIRECTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDirection(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${direction === opt.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-32 rounded-xl border border-slate-200" style={{ background: `linear-gradient(${direction}, ${color1}, ${color2})` }} />
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <code className="text-xs font-mono text-slate-700 break-all">{cssCode}</code>
          <Button variant="ghost" onClick={handleCopy}><Copy size={16} /></Button>
        </div>
      </div>
    </div>
  );
}
