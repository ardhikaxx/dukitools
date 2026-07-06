'use client';

import { useState, useMemo } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';

interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

function describeCron(cron: CronFields): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = cron;

  if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return 'Every minute';
  }
  if (minute !== '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `Every hour at minute ${minute}`;
  }
  if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `At ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} every day`;
  }
  if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
    const days: Record<string, string> = { '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday' };
    const dayNames = dayOfWeek.includes('-')
      ? dayOfWeek.split('-').map((d) => days[d] || d).join(' through ')
      : dayOfWeek.split(',').map((d) => days[d] || d).join(', ');
    return `At ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}, ${dayNames}`;
  }
  const parts = [minute, hour, dayOfMonth, month, dayOfWeek].filter((p) => p !== '*');
  if (parts.length <= 2) return `Custom schedule: ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  return `Scheduled: ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

const MINUTES = ['*', ...Array.from({ length: 60 }, (_, i) => String(i))];
const HOURS = ['*', ...Array.from({ length: 24 }, (_, i) => String(i))];
const DAYS_OF_MONTH = ['*', ...Array.from({ length: 31 }, (_, i) => String(i + 1))];
const MONTHS = ['*', ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
const DAYS_OF_WEEK = ['*', ...Array.from({ length: 7 }, (_, i) => String(i))];

export default function CronExpressionGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [cron, setCron] = useState<CronFields>({
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  });
  const toast = useToast();

  function update(field: keyof CronFields, value: string) {
    setCron((prev) => ({ ...prev, [field]: value }));
  }

  const expression = useMemo(() => `${cron.minute} ${cron.hour} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`, [cron]);
  const description = useMemo(() => describeCron(cron), [cron]);

  function handleReset() {
    setCron({ minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' });
    toast.success('Cron expression berhasil direset.');
  }

  const selectClass = "rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-white";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Minute (0-59)</label>
          <select value={cron.minute} onChange={(e) => update('minute', e.target.value)} className={`${selectClass} w-full`}>
            {MINUTES.map((m) => <option key={m} value={m}>{m === '*' ? 'Every' : m}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Hour (0-23)</label>
          <select value={cron.hour} onChange={(e) => update('hour', e.target.value)} className={`${selectClass} w-full`}>
            {HOURS.map((h) => <option key={h} value={h}>{h === '*' ? 'Every' : h}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Day of Month (1-31)</label>
          <select value={cron.dayOfMonth} onChange={(e) => update('dayOfMonth', e.target.value)} className={`${selectClass} w-full`}>
            {DAYS_OF_MONTH.map((d) => <option key={d} value={d}>{d === '*' ? 'Every' : d}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Month (1-12)</label>
          <select value={cron.month} onChange={(e) => update('month', e.target.value)} className={`${selectClass} w-full`}>
            {MONTHS.map((m) => <option key={m} value={m}>{m === '*' ? 'Every' : m}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Day of Week (0-6)</label>
          <select value={cron.dayOfWeek} onChange={(e) => update('dayOfWeek', e.target.value)} className={`${selectClass} w-full`}>
            {DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d === '*' ? 'Every' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseInt(d)]}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center">
        <p className="text-xs text-slate-500 mb-1">Cron Expression</p>
        <p className="text-lg font-mono font-bold text-indigo-700">{expression}</p>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
        <p className="text-xs text-slate-500 mb-1">Human-readable Description</p>
        <p className="text-sm font-medium text-emerald-700">{expression} → {description}</p>
      </div>

      <ToolActions textResult={expression} onReset={handleReset} />
    </div>
  );
}
