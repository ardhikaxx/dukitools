'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';

interface TaxResult {
  tax: number;
  netIncome: number;
  bracket: string;
}

function calculateTax(income: number): TaxResult {
  let tax = 0;
  let bracket = '';

  if (income <= 50000000) {
    tax = income * 0.05;
    bracket = '5%';
  } else if (income <= 250000000) {
    tax = 50000000 * 0.05 + (income - 50000000) * 0.15;
    bracket = '15%';
  } else if (income <= 500000000) {
    tax = 50000000 * 0.05 + 200000000 * 0.15 + (income - 250000000) * 0.25;
    bracket = '25%';
  } else {
    tax = 50000000 * 0.05 + 200000000 * 0.15 + 250000000 * 0.25 + (income - 500000000) * 0.30;
    bracket = '30%';
  }

  return { tax: Math.round(tax), netIncome: Math.round(income - tax), bracket };
}

export default function TaxCalculatorWorkspace({ tool }: { tool: ToolConfig }) {
  const [income, setIncome] = useState('');
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate() {
    const val = parseFloat(income);
    if (!val || val <= 0) {
      setError('Masukkan jumlah penghasilan yang valid.');
      return;
    }
    setError(null);
    setResult(calculateTax(val));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Penghasilan Tahunan (Rp)</label>
        <input type="number" value={income} onChange={(e) => { setIncome(e.target.value); setError(null); }} placeholder="Contoh: 120000000" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <Button onClick={handleCalculate}>Hitung Pajak</Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">Tarif Pajak</p>
            <p className="text-xl font-bold text-indigo-600">{result.bracket}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">Pajak</p>
            <p className="text-xl font-bold text-red-500">Rp {result.tax.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">Penghasilan Bersih</p>
            <p className="text-xl font-bold text-green-600">Rp {result.netIncome.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
