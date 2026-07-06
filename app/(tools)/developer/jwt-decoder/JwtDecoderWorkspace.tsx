'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { Copy, Key, Play, Shield } from 'lucide-react';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch {
    return atob(base64);
  }
}

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

export default function JwtDecoderWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function handleDecode() {
    setHeader('');
    setPayload('');
    setSignature('');
    setError(null);

    const trimmed = input.trim();
    if (!trimmed) {
      toast.warning('Masukkan JWT token terlebih dahulu.');
      return;
    }

    const parts = trimmed.split('.');
    if (parts.length !== 3) {
      const msg = 'JWT tidak valid: token harus terdiri dari 3 bagian (header.payload.signature).';
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      const decodedHeader = base64UrlDecode(parts[0]);
      const decodedPayload = base64UrlDecode(parts[1]);
      setHeader(formatJson(decodedHeader));
      setPayload(formatJson(decodedPayload));
      setSignature(parts[2]);
      toast.success('JWT berhasil didecode!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal mendecode JWT.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setInput('');
    setHeader('');
    setPayload('');
    setSignature('');
    setError(null);
  }

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin!`);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">JWT Token</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder="Tempel JWT token di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[120px]"
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleDecode}>
          <Play size={16} className="mr-1.5" /> Decode
        </Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {header && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Shield size={16} /> Header
              </div>
              <button
                type="button"
                onClick={() => copyText(header, 'Header')}
                className="text-slate-400 hover:text-indigo-600 transition"
              >
                <Copy size={14} />
              </button>
            </div>
            <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-3 text-sm font-mono whitespace-pre-wrap">{header}</pre>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Key size={16} /> Payload
              </div>
              <button
                type="button"
                onClick={() => copyText(payload, 'Payload')}
                className="text-slate-400 hover:text-indigo-600 transition"
              >
                <Copy size={14} />
              </button>
            </div>
            <pre className="max-h-64 overflow-auto rounded bg-slate-50 p-3 text-sm font-mono whitespace-pre-wrap">{payload}</pre>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                Signature
              </div>
              <button
                type="button"
                onClick={() => copyText(signature, 'Signature')}
                className="text-slate-400 hover:text-indigo-600 transition"
              >
                <Copy size={14} />
              </button>
            </div>
            <pre className="max-h-24 overflow-auto rounded bg-slate-50 p-3 text-sm font-mono break-all">{signature}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
