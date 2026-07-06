'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean) && !/^[0-9a-fA-F]{3}$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.min(255, Math.max(0, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

function isValidRgbInput(val: string): { r: number; g: number; b: number } | null {
  const parts = val.split(',').map((s) => parseInt(s.trim()));
  if (parts.length !== 3 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return null;
  return { r: parts[0], g: parts[1], b: parts[2] };
}

export default function HexToRgbWorkspace({ tool }: { tool: ToolConfig }) {
  const [hexValue, setHexValue] = useState('#');
  const [rgbValue, setRgbValue] = useState('');
  const [preview, setPreview] = useState('#000000');
  const toast = useToast();

  function handleHexChange(value: string) {
    setHexValue(value);
    const rgb = hexToRgb(value);
    if (rgb) {
      setRgbValue(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
      setPreview(value);
    }
  }

  function handleRgbChange(value: string) {
    setRgbValue(value);
    const rgb = isValidRgbInput(value);
    if (rgb) {
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setHexValue(hex);
      setPreview(hex);
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success('Disalin!');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">HEX</label>
          <input value={hexValue} onChange={(e) => handleHexChange(e.target.value)} placeholder="#FF5733" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <Button variant="ghost" onClick={() => copy(hexValue)}><Copy size={16} /></Button>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">RGB</label>
          <input value={rgbValue} onChange={(e) => handleRgbChange(e.target.value)} placeholder="255, 87, 51" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <Button variant="ghost" onClick={() => copy(rgbValue)}><Copy size={16} /></Button>
      </div>
      <div className="h-20 rounded-xl border border-slate-200 transition-colors" style={{ backgroundColor: preview }} />
    </div>
  );
}
