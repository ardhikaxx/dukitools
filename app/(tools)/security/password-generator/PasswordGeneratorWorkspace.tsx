'use client';

import { useState, useCallback } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

const AMBIGUOUS = /[iloILO01]/g;

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useNumbers: boolean, useSymbols: boolean, excludeAmbiguous: boolean): string {
  let chars = '';
  if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumbers) chars += '0123456789';
  if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) return '';
  if (excludeAmbiguous) chars = chars.replace(AMBIGUOUS, '');

  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const levels = [
    { label: 'Sangat Lemah', color: 'bg-red-500', width: '20%' },
    { label: 'Lemah', color: 'bg-orange-500', width: '40%' },
    { label: 'Sedang', color: 'bg-yellow-500', width: '60%' },
    { label: 'Kuat', color: 'bg-lime-500', width: '80%' },
    { label: 'Sangat Kuat', color: 'bg-green-500', width: '100%' },
  ];
  return levels[Math.min(score, levels.length - 1)];
}

export default function PasswordGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const toast = useToast();

  const generate = useCallback(() => {
    const pwd = generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous);
    setPassword(pwd);
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  async function handleCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast.success('Password disalin!');
  }

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Panjang: {length}</label>
        <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-slate-400"><span>4</span><span>64</span></div>
      </div>
      <div className="space-y-2">
        {[
          { label: 'Huruf Besar (A-Z)', value: useUpper, set: setUseUpper },
          { label: 'Huruf Kecil (a-z)', value: useLower, set: setUseLower },
          { label: 'Angka (0-9)', value: useNumbers, set: setUseNumbers },
          { label: 'Simbol (!@#$%...)', value: useSymbols, set: setUseSymbols },
          { label: 'Exclude Ambiguous (iloILO01)', value: excludeAmbiguous, set: setExcludeAmbiguous },
        ].map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={opt.value} onChange={(e) => opt.set(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            {opt.label}
          </label>
        ))}
      </div>
      <Button onClick={generate} fullWidth>
        <RefreshCw size={16} className="mr-1.5" /> Generate Password
      </Button>
      {password && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <code className="break-all text-lg font-mono text-slate-800">{password}</code>
            <Button variant="ghost" onClick={handleCopy}><Copy size={18} /></Button>
          </div>
          {strength && (
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className={`h-2 rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
              </div>
              <p className="mt-1 text-xs text-slate-500">Kekuatan: {strength.label}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
