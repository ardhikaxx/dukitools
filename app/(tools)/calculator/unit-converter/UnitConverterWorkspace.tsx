'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { RotateCcw, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

const categories: Record<string, { label: string; units: Record<string, number>; customConvert?: boolean }> = {
  length: {
    label: 'Length',
    units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344 },
  },
  weight: {
    label: 'Weight',
    units: { mg: 0.000001, g: 0.001, kg: 1, ton: 1000, ounce: 0.0283495, pound: 0.453592 },
  },
  temperature: {
    label: 'Temperature',
    units: { celsius: 0, fahrenheit: 0, kelvin: 0 },
    customConvert: true,
  },
  volume: {
    label: 'Volume',
    units: { mL: 0.001, L: 1, gallon: 3.78541, quart: 0.946353, pint: 0.473176, cup: 0.236588 },
  },
};

function convertTemp(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === 'celsius') celsius = value;
  else if (from === 'fahrenheit') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === 'celsius') return celsius;
  if (to === 'fahrenheit') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverterWorkspace({ tool }: { tool: ToolConfig }) {
  const [category, setCategory] = useState('length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');
  const [value, setValue] = useState('1');
  const toast = useToast();

  const cat = categories[category];
  const catUnits = Object.entries(cat.units);

  let result: number | null = null;
  const num = parseFloat(value);
  if (!isNaN(num)) {
    if (category === 'temperature') {
      result = convertTemp(num, from, to);
    } else {
      const baseValue = num * (cat.units[from] as number);
      result = baseValue / (cat.units[to] as number);
    }
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  function handleReset() {
    setCategory('length');
    setFrom('m');
    setTo('km');
    setValue('1');
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setFrom('m'); setTo('km'); }}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          {Object.entries(categories).map(([key, c]) => <option key={key} value={key}>{c.label}</option>)}
        </select>
      </div>

      <Input label="Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1" />

      <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {catUnits.map(([key]) => <option key={key} value={key}>{key}</option>)}
          </select>
        </div>
        <Button variant="ghost" onClick={handleSwap} className="mb-0.5">
          <ArrowLeftRight size={18} />
        </Button>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {catUnits.map(([key]) => <option key={key} value={key}>{key}</option>)}
          </select>
        </div>
      </div>

      {result !== null && (
        <div className="rounded-xl border border-slate-200 bg-indigo-50 p-4 text-center">
          <p className="text-xs text-slate-500">Result</p>
          <p className="text-2xl font-bold text-indigo-700">
            {num} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}
          </p>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw size={16} className="mr-1.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
