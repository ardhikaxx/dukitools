'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/toast/toastStore';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.min(255, Math.max(0, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function generatePalette(hex: string): string[] {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const rotations = [0, 30, 60, 120, 180];
  return rotations.map((deg) => {
    const newH = (h + deg) % 360;
    const [nr, ng, nb] = hslToRgb(newH, s, l);
    return rgbToHex(nr, ng, nb);
  });
}

export default function ColorPaletteGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [base, setBase] = useState('#6366f1');
  const [palette, setPalette] = useState<string[]>(() => generatePalette('#6366f1'));
  const toast = useToast();

  function handleGenerate() {
    if (!/^#[0-9a-fA-F]{6}$/.test(base) && !/^#[0-9a-fA-F]{3}$/.test(base)) {
      toast.warning('Masukkan HEX yang valid (contoh: #6366f1).');
      return;
    }
    setPalette(generatePalette(base));
  }

  async function copyHex(hex: string) {
    await navigator.clipboard.writeText(hex);
    toast.success(`${hex} disalin!`);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Warna Dasar</label>
          <input value={base} onChange={(e) => setBase(e.target.value)} placeholder="#6366f1" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {palette.map((hex) => (
          <button
            key={hex}
            onClick={() => copyHex(hex)}
            className="group relative aspect-square rounded-xl border border-slate-200 transition-transform hover:scale-105"
            style={{ backgroundColor: hex }}
          >
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-white/80 px-1 text-[10px] font-mono text-slate-700 opacity-0 transition group-hover:opacity-100">{hex}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
