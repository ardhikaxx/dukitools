'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import Button from '@/components/ui/Button';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/toast/toastStore';

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function md5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [hashSha256, setHashSha256] = useState('');
  const [hashMd5, setHashMd5] = useState('');
  const [selected, setSelected] = useState({ sha256: true, md5: false });
  const toast = useToast();

  async function handleGenerate() {
    if (!input.trim()) {
      toast.warning('Masukkan teks terlebih dahulu.');
      return;
    }
    if (!selected.sha256 && !selected.md5) {
      toast.warning('Pilih minimal satu algoritma hash.');
      return;
    }
    if (selected.sha256) setHashSha256(await sha256(input));
    if (selected.md5) setHashMd5(await md5(input));
  }

  function handleReset() {
    setInput('');
    setHashSha256('');
    setHashMd5('');
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success('Hash disalin!');
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Input Teks</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan teks yang akan di-hash..."
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y"
        />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={selected.sha256} onChange={(e) => setSelected((s) => ({ ...s, sha256: e.target.checked }))} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          SHA-256
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={selected.md5} onChange={(e) => setSelected((s) => ({ ...s, md5: e.target.checked }))} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          MD5
        </label>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleGenerate}>Generate Hash</Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>
      {hashSha256 && (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500">SHA-256</span>
            <Button variant="ghost" onClick={() => copy(hashSha256)}><Copy size={14} /></Button>
          </div>
          <code className="break-all text-xs font-mono text-slate-700">{hashSha256}</code>
        </div>
      )}
      {hashMd5 && (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500">MD5</span>
            <Button variant="ghost" onClick={() => copy(hashMd5)}><Copy size={14} /></Button>
          </div>
          <code className="break-all text-xs font-mono text-slate-700">{hashMd5}</code>
        </div>
      )}
    </div>
  );
}
