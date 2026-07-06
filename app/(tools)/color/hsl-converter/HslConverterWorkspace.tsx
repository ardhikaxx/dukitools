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

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / d + 2) * 60;
  else h = ((rn - gn) / d + 4) * 60;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function HslConverterWorkspace({ tool }: { tool: ToolConfig }) {
  const [hex, setHex] = useState('#FF5733');
  const toast = useToast();

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const rgbStr = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '-';
  const hslStr = hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : '-';

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
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

      {hsl && (
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">HEX</p>
              <p className="font-mono text-sm text-slate-800">{hex}</p>
            </div>
            <Button variant="ghost" onClick={() => copy(hex, 'HEX')}><Copy size={14} /></Button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">RGB</p>
              <p className="font-mono text-sm text-slate-800">{rgbStr}</p>
            </div>
            <Button variant="ghost" onClick={() => copy(rgbStr, 'RGB')}><Copy size={14} /></Button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">HSL</p>
              <p className="font-mono text-sm text-slate-800">{hslStr}</p>
            </div>
            <Button variant="ghost" onClick={() => copy(hslStr, 'HSL')}><Copy size={14} /></Button>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Hue ({hsl.h}°)</span>
              </div>
              <div className="h-3 w-full rounded-full" style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Saturation ({hsl.s}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-gray-400 via-indigo-500 to-indigo-800" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Lightness ({hsl.l}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-black via-gray-500 to-white" />
            </div>
          </div>
        </div>
      )}

      {!hsl && <p className="text-sm text-red-500">Invalid HEX color.</p>}

      <div className="flex justify-center gap-3">
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw size={16} className="mr-1.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
