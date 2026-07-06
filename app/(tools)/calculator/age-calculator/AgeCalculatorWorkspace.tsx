'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
}

function calculateAge(birthDate: Date): AgeResult {
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = now.getTime() - birthDate.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor(diffMs / (1000 * 60));

  return { years, months, days, hours, minutes };
}

export default function AgeCalculatorWorkspace({ tool }: { tool: ToolConfig }) {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);

  function handleCalculate() {
    if (!birthDate) return;
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return;
    setResult(calculateAge(date));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tanggal Lahir</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => { setBirthDate(e.target.value); setResult(null); }}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <Button onClick={handleCalculate} disabled={!birthDate}>Hitung Usia</Button>
      {result && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Tahun', value: result.years },
            { label: 'Bulan', value: result.months },
            { label: 'Hari', value: result.days },
            { label: 'Jam', value: result.hours.toLocaleString() },
            { label: 'Menit', value: result.minutes.toLocaleString() },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{item.value}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
