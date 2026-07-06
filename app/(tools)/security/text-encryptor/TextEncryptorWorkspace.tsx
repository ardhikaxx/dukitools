'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { Copy, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

function simpleXor(text: string, key: string): string {
  return text.split('').map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');
}

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return '';
  }
}

export default function TextEncryptorWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState('');
  const toast = useToast();

  function handleProcess() {
    if (!input.trim() || !key.trim()) {
      toast.warning('Masukkan teks dan password/key.');
      return;
    }
    if (mode === 'encrypt') {
      setResult(toBase64(simpleXor(input, key)));
    } else {
      const decoded = fromBase64(input);
      if (!decoded) {
        toast.error('Teks terenkripsi tidak valid.');
        return;
      }
      setResult(simpleXor(decoded, key));
    }
  }

  function handleReset() {
    setInput('');
    setKey('');
    setResult('');
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast.success('Hasil disalin!');
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Teks</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Masukkan teks yang akan dienkripsi...' : 'Masukkan teks terenkripsi...'}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password / Key</label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Masukkan password..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encrypt')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${mode === 'encrypt' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <Lock size={14} /> Enkripsi
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${mode === 'decrypt' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <Unlock size={14} /> Dekripsi
        </button>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleProcess}>{mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'}</Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>
      {result && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Hasil</span>
            <Button variant="ghost" onClick={handleCopy}><Copy size={14} /></Button>
          </div>
          <code className="break-all text-sm font-mono text-slate-700">{result}</code>
        </div>
      )}
    </div>
  );
}
