'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';

type Mode = 'percent-of' | 'is-what-percent' | 'percent-change';

export default function PercentageCalculatorWorkspace({ tool }: { tool: ToolConfig }) {
  const [mode, setMode] = useState<Mode>('percent-of');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function handleCalculate() {
    const a = parseFloat(val1);
    const b = parseFloat(val2);
    if (!a || !b) return;

    let res: string;
    switch (mode) {
      case 'percent-of':
        res = `${(a / 100 * b).toFixed(2)}`;
        break;
      case 'is-what-percent':
        res = `${(a / b * 100).toFixed(2)}%`;
        break;
      case 'percent-change':
        res = `${(((b - a) / a) * 100).toFixed(2)}%`;
        break;
    }
    setResult(res);
  }

  function handleReset() {
    setVal1('');
    setVal2('');
    setResult(null);
  }

  const labels: Record<Mode, { v1: string; v2: string; desc: string }> = {
    'percent-of': { v1: 'Persentase (%)', v2: 'Nilai', desc: 'X% dari Y adalah' },
    'is-what-percent': { v1: 'Nilai X', v2: 'Nilai Y', desc: 'X adalah berapa % dari Y' },
    'percent-change': { v1: 'Nilai Awal (X)', v2: 'Nilai Akhir (Y)', desc: 'Perubahan % dari X ke Y' },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['percent-of', 'is-what-percent', 'percent-change'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${mode === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {m === 'percent-of' ? 'X% dari Y' : m === 'is-what-percent' ? 'X % dari Y' : '% Perubahan'}
          </button>
        ))}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{labels[mode].v1}</label>
        <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{labels[mode].v2}</label>
        <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleCalculate}>Hitung</Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>
      {result !== null && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-500">{labels[mode].desc}</p>
          <p className="text-2xl font-bold text-indigo-600">{result}</p>
        </div>
      )}
    </div>
  );
}
