'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean) && !/^[0-9a-fA-F]{3}$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number | null {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) return null;
  const l1 = luminance(c1.r, c1.g, c1.b);
  const l2 = luminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ContrastCheckerWorkspace({ tool }: { tool: ToolConfig }) {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const toast = useToast();

  const ratio = contrastRatio(fg, bg);
  const aaNorm = ratio !== null && ratio >= 4.5;
  const aaLarge = ratio !== null && ratio >= 3;
  const aaaNorm = ratio !== null && ratio >= 7;
  const aaaLarge = ratio !== null && ratio >= 4.5;

  function handleReset() {
    setFg('#000000');
    setBg('#ffffff');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Foreground</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200" />
            <input value={fg} onChange={(e) => setFg(e.target.value)} placeholder="#000000" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Background</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200" />
            <input value={bg} onChange={(e) => setBg(e.target.value)} placeholder="#ffffff" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-xl border border-slate-200 p-8 transition-colors" style={{ backgroundColor: bg }}>
        <p className="text-2xl font-bold transition-colors" style={{ color: fg }}>Sample Text</p>
      </div>

      {ratio !== null && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="text-center">
            <p className="text-xs text-slate-500">Contrast Ratio</p>
            <p className="text-3xl font-bold text-slate-800">{ratio.toFixed(2)}:1</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${aaNorm ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>WCAG AA Normal: {aaNorm ? 'Pass' : 'Fail'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${aaLarge ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>WCAG AA Large: {aaLarge ? 'Pass' : 'Fail'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${aaaNorm ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>WCAG AAA Normal: {aaaNorm ? 'Pass' : 'Fail'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${aaaLarge ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>WCAG AAA Large: {aaaLarge ? 'Pass' : 'Fail'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw size={16} className="mr-1.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
