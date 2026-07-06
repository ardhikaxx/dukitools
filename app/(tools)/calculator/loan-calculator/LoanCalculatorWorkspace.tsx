'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

function calculateLoan(amount: number, rate: number, years: number): LoanResult {
  const monthlyRate = rate / 100 / 12;
  const payments = years * 12;
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
  const totalPayment = monthlyPayment * payments;
  const totalInterest = totalPayment - amount;
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

export default function LoanCalculatorWorkspace({ tool }: { tool: ToolConfig }) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<LoanResult | null>(null);

  function handleCalculate() {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (!a || !r || !y || a <= 0 || r <= 0 || y <= 0) return;
    setResult(calculateLoan(a, r, y));
  }

  function handleReset() {
    setAmount('');
    setRate('');
    setYears('');
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Jumlah Pinjaman (Rp)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Contoh: 100000000" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Suku Bunga (%) per Tahun</label>
        <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Contoh: 10" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tenor (Tahun)</label>
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="Contoh: 5" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleCalculate}>Hitung</Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>
      {result && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">Angsuran Bulanan</p>
            <p className="text-xl font-bold text-indigo-600">Rp {result.monthlyPayment.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">Total Pembayaran</p>
            <p className="text-xl font-bold text-indigo-600">Rp {result.totalPayment.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-xs text-slate-500">Total Bunga</p>
            <p className="text-xl font-bold text-red-500">Rp {result.totalInterest.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
