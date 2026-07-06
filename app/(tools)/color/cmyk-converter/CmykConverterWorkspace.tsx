'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 1 };
  return {
    c: (1 - rn - k) / (1 - k),
    m: (1 - gn - k) / (1 - k),
    y: (1 - bn - k) / (1 - k),
    k,
  };
}

export default function CmykConverterWorkspace({ tool }: { tool: ToolConfig }) {
  const [hex, setHex] = useState('#FF5733');
  const toast = useToast();

  const rgb = hexToRgb(hex);
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;

  const cmykStr = cmyk ? `${(cmyk.c * 100).toFixed(1)}%, ${(cmyk.m * 100).toFixed(1)}%, ${(cmyk.y * 100).toFixed(1)}%, ${(cmyk.k * 100).toFixed(1)}%` : '-';

  async function handleCopy() {
    await navigator.clipboard.writeText(cmykStr);
    toast.success('CMYK copied!');
  }

  function handleReset() {
    setHex('#FF5733');
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">HEX Color</label>
        <div className="flex items-center gap-2">
          <input type="color" value={rgb ? hex : '#000000'} onChange={(e) => setHex(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200" />
          <input value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#FF5733" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>
      </div>

      <div className="h-20 rounded-xl border border-slate-200 transition-colors" style={{ backgroundColor: rgb ? hex : '#000000' }} />

      {cmyk && (
        <div className="space-y-3">
          {[
            { label: 'Cyan', value: cmyk.c },
            { label: 'Magenta', value: cmyk.m },
            { label: 'Yellow', value: cmyk.y },
            { label: 'Key (Black)', value: cmyk.k },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-sm font-mono text-slate-600">{(value * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${value * 100}%` }} />
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500 mb-1">CMYK Values</p>
            <p className="font-mono text-sm text-slate-800">{cmykStr}</p>
          </div>
        </div>
      )}

      {!cmyk && <p className="text-sm text-red-500">Invalid HEX color. Please enter a valid 6-digit HEX code.</p>}

      <div className="flex justify-center gap-3">
        <Button variant="primary" onClick={handleCopy}>
          <Copy size={16} className="mr-1.5" /> Copy CMYK
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw size={16} className="mr-1.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
