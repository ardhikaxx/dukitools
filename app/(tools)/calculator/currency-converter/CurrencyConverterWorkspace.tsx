'use client';

import { useState, useMemo } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';

const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  IDR: 15750,
  SGD: 1.35,
  MYR: 4.68,
};

const CURRENCIES = Object.keys(RATES);

function convert(amount: number, from: string, to: string): number {
  const inUsd = amount / RATES[from];
  return inUsd * RATES[to];
}

export default function CurrencyConverterWorkspace({ tool }: { tool: ToolConfig }) {
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('IDR');
  const [result, setResult] = useState<number | null>(null);

  const rate = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return null;
    return RATES[to] / RATES[from];
  }, [amount, from, to]);

  function handleConvert() {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    setResult(Math.round(convert(val, from, to) * 100) / 100);
  }

  function handleSwap() {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Jumlah</label>
        <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setResult(null); }} placeholder="Contoh: 100" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Dari</label>
          <select value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Button variant="ghost" onClick={handleSwap} className="mb-0.5">⇄</Button>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Ke</label>
          <select value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {rate && <p className="text-xs text-slate-400">1 {from} = {rate.toFixed(4)} {to}</p>}
      <Button onClick={handleConvert}>Konversi</Button>
      {result !== null && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-500">Hasil</p>
          <p className="text-2xl font-bold text-indigo-600">{result.toLocaleString()} {to}</p>
        </div>
      )}
    </div>
  );
}
