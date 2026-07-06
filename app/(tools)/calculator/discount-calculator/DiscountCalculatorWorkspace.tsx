'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';

export default function DiscountCalculatorWorkspace({ tool }: { tool: ToolConfig }) {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [result, setResult] = useState<{ savings: number; finalPrice: number } | null>(null);

  function handleCalculate() {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (!p || !d || p <= 0 || d <= 0) return;

    let savings: number;
    if (discountType === 'percent') {
      savings = p * (d / 100);
    } else {
      savings = d;
    }
    setResult({
      savings: Math.round(savings * 100) / 100,
      finalPrice: Math.round((p - savings) * 100) / 100,
    });
  }

  function handleReset() {
    setPrice('');
    setDiscount('');
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Harga Asli (Rp)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Contoh: 500000" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setDiscountType('percent')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${discountType === 'percent' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Diskon %
        </button>
        <button
          onClick={() => setDiscountType('amount')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${discountType === 'amount' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Diskon Rp
        </button>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{discountType === 'percent' ? 'Diskon (%)' : 'Diskon (Rp)'}</label>
        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder={discountType === 'percent' ? 'Contoh: 20' : 'Contoh: 100000'} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleCalculate}>Hitung</Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">Hemat</p>
            <p className="text-xl font-bold text-green-600">Rp {result.savings.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">Harga Akhir</p>
            <p className="text-xl font-bold text-indigo-600">Rp {result.finalPrice.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
