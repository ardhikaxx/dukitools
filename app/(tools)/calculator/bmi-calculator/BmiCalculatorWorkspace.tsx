'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';

function calculateBMI(weight: number, heightCm: number): { bmi: number; category: string; color: string } {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let category: string;
  let color: string;
  if (bmi < 18.5) {
    category = 'Kurus';
    color = 'text-yellow-500';
  } else if (bmi < 25) {
    category = 'Normal';
    color = 'text-green-500';
  } else if (bmi < 30) {
    category = 'Kelebihan Berat Badan';
    color = 'text-orange-500';
  } else {
    category = 'Obesitas';
    color = 'text-red-500';
  }
  return { bmi: Math.round(bmi * 10) / 10, category, color };
}

export default function BmiCalculatorWorkspace({ tool }: { tool: ToolConfig }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  function handleCalculate() {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return;
    setResult(calculateBMI(w, h));
  }

  function handleReset() {
    setWeight('');
    setHeight('');
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Berat Badan (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Contoh: 70"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tinggi Badan (cm)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Contoh: 175"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleCalculate}>Hitung BMI</Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>
      {result && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-4xl font-bold text-indigo-600">{result.bmi}</p>
          <p className={`mt-2 text-lg font-semibold ${result.color}`}>{result.category}</p>
        </div>
      )}
    </div>
  );
}
