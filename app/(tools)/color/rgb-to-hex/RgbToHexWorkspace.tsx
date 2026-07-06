'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.min(255, Math.max(0, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

export default function RgbToHexWorkspace({ tool }: { tool: ToolConfig }) {
  const [r, setR] = useState('255');
  const [g, setG] = useState('87');
  const [b, setB] = useState('51');
  const toast = useToast();

  const rn = parseInt(r) || 0;
  const gn = parseInt(g) || 0;
  const bn = parseInt(b) || 0;
  const hex = rgbToHex(Math.min(255, Math.max(0, rn)), Math.min(255, Math.max(0, gn)), Math.min(255, Math.max(0, bn)));

  async function handleCopy() {
    await navigator.clipboard.writeText(hex);
    toast.success('HEX copied!');
  }

  function handleReset() {
    setR('255');
    setG('87');
    setB('51');
  }

  function clamp(val: string): string {
    const n = parseInt(val);
    if (isNaN(n)) return '0';
    return String(Math.min(255, Math.max(0, n)));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {[
          { label: 'R', value: r, setter: setR, color: 'accent-red' },
          { label: 'G', value: g, setter: setG, color: 'accent-green' },
          { label: 'B', value: b, setter: setB, color: 'accent-blue' },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="mb-1 block text-sm font-medium text-slate-700">{label} (0-255)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={255}
                value={clamp(value)}
                onChange={(e) => setter(e.target.value)}
                className="flex-1 accent-indigo-600"
              />
              <input
                type="number"
                min={0}
                max={255}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono text-center outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-16 w-full rounded-xl border border-slate-200 transition-colors" style={{ backgroundColor: hex }} />
        <div className="text-center">
          <p className="text-xs text-slate-500">HEX</p>
          <p className="font-mono text-lg font-bold text-slate-800">{hex}</p>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="primary" onClick={handleCopy}>
          <Copy size={16} className="mr-1.5" /> Copy HEX
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw size={16} className="mr-1.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
