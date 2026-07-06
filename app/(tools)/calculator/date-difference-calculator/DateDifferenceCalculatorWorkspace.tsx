'use client';

import { useState, useMemo } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

function diff(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  if (ms < 0) return null;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  const monthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  let daysRemaining = end.getDate() - start.getDate();
  if (daysRemaining < 0) { months--; daysRemaining += monthDays; if (months < 0) { years--; months += 12; } }

  return { years, months, days: daysRemaining, hours: hours % 24, minutes: minutes % 60, seconds: seconds % 60, totalDays: days };
}

export default function DateDifferenceCalculatorWorkspace({ tool }: { tool: ToolConfig }) {
  const today = new Date().toISOString().split('T')[0];
  const [start, setStart] = useState('2024-01-01');
  const [end, setEnd] = useState(today);
  const toast = useToast();

  const result = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    return diff(s, e);
  }, [start, end]);

  function handleReset() {
    setStart('2024-01-01');
    setEnd(today);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Start Date</label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">End Date</label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>
      </div>

      {result && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-white p-3 border border-slate-100">
              <p className="text-2xl font-bold text-indigo-600">{result.years}</p>
              <p className="text-xs text-slate-500">Years</p>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-100">
              <p className="text-2xl font-bold text-indigo-600">{result.months}</p>
              <p className="text-xs text-slate-500">Months</p>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-100">
              <p className="text-2xl font-bold text-indigo-600">{result.days}</p>
              <p className="text-xs text-slate-500">Days</p>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-100">
              <p className="text-2xl font-bold text-indigo-600">{result.hours}</p>
              <p className="text-xs text-slate-500">Hours</p>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-100">
              <p className="text-2xl font-bold text-indigo-600">{result.minutes}</p>
              <p className="text-xs text-slate-500">Minutes</p>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-100">
              <p className="text-2xl font-bold text-indigo-600">{result.seconds}</p>
              <p className="text-xs text-slate-500">Seconds</p>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">Total: <strong>{result.totalDays.toLocaleString()}</strong> days</p>
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw size={16} className="mr-1.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
