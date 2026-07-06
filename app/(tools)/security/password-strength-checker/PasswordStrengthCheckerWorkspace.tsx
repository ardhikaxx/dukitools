'use client';

import { useState, useMemo } from 'react';
import { ToolConfig } from '@/types/tool';

interface Check {
  label: string;
  passed: boolean;
}

function evaluate(password: string): { checks: Check[]; score: number; maxScore: number; label: string; color: string; crackTime: string } {
  const checks: Check[] = [
    { label: 'Minimal 8 karakter', passed: password.length >= 8 },
    { label: 'Huruf besar (A-Z)', passed: /[A-Z]/.test(password) },
    { label: 'Huruf kecil (a-z)', passed: /[a-z]/.test(password) },
    { label: 'Angka (0-9)', passed: /\d/.test(password) },
    { label: 'Simbol (!@#$%...)', passed: /[^a-zA-Z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.passed).length;
  const maxScore = checks.length;

  const levels = [
    { label: 'Sangat Lemah', color: 'bg-red-500' },
    { label: 'Lemah', color: 'bg-orange-500' },
    { label: 'Sedang', color: 'bg-yellow-500' },
    { label: 'Kuat', color: 'bg-lime-500' },
    { label: 'Sangat Kuat', color: 'bg-green-500' },
  ];
  const level = levels[Math.min(score, levels.length - 1)];

  let crackTime = 'Kurang dari sedetik';
  if (score >= 5) crackTime = 'Bertahun-tahun';
  else if (score >= 4) crackTime = 'Berbulan-bulan';
  else if (score >= 3) crackTime = 'Berhari-hari';
  else if (score >= 2) crackTime = 'Beberapa jam';

  return { checks, score, maxScore, label: level.label, color: level.color, crackTime };
}

export default function PasswordStrengthCheckerWorkspace({ tool }: { tool: ToolConfig }) {
  const [pwd, setPwd] = useState('');

  const evaluation = useMemo(() => pwd ? evaluate(pwd) : null, [pwd]);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Masukkan Password</label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Ketik password di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      {evaluation && (
        <div className="space-y-3">
          <div className="h-3 w-full rounded-full bg-slate-200">
            <div className={`h-3 rounded-full transition-all ${evaluation.color}`} style={{ width: `${(evaluation.score / evaluation.maxScore) * 100}%` }} />
          </div>
          <p className="text-center text-sm font-medium">{evaluation.label}</p>
          <div className="space-y-1.5">
            {evaluation.checks.map((check) => (
              <div key={check.label} className="flex items-center gap-2 text-sm">
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${check.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                  {check.passed ? '✓' : '✗'}
                </span>
                <span className={check.passed ? 'text-slate-700' : 'text-slate-400'}>{check.label}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-sm text-slate-600">
            Estimasi waktu crack: <strong>{evaluation.crackTime}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
