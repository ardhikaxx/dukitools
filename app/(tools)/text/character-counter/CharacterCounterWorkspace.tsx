'use client';

import { useState, useMemo } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';

interface LimitBar {
  label: string;
  limit: number;
}

const LIMITS: LimitBar[] = [
  { label: 'Twitter', limit: 280 },
  { label: 'SMS', limit: 160 },
  { label: 'Facebook Post', limit: 63206 },
  { label: 'Instagram Caption', limit: 2200 },
];

export default function CharacterCounterWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const toast = useToast();

  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const bars = useMemo(() => {
    return LIMITS.map((l) => ({
      ...l,
      usage: Math.min((charsWithSpaces / l.limit) * 100, 100),
      isOver: charsWithSpaces > l.limit,
    }));
  }, [charsWithSpaces]);

  function handleReset() {
    setText('');
    toast.success('Teks berhasil direset.');
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ketik atau tempel teks di sini..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
        rows={8}
      />

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{charsWithSpaces.toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-500">Karakter (dengan spasi)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{charsWithoutSpaces.toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-500">Karakter (tanpa spasi)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{words.toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-500">Kata</p>
        </div>
      </div>

      {text && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Perbandingan Batas Karakter</p>
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{bar.label}</span>
                <span className={bar.isOver ? 'font-semibold text-red-500' : ''}>
                  {charsWithSpaces.toLocaleString()} / {bar.limit.toLocaleString()}
                  {bar.isOver && ' (melebihi batas)'}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    bar.isOver ? 'bg-red-500' : bar.usage > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${bar.usage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ToolActions textResult={text} onReset={handleReset} />
    </div>
  );
}
