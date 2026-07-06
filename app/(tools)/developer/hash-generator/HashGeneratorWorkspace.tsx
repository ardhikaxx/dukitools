'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import Button from '@/components/ui/Button';
import { Copy, Hash, RotateCcw } from 'lucide-react';

type Algorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512';

const ALGORITHMS: { key: Algorithm; label: string }[] = [
  { key: 'MD5', label: 'MD5' },
  { key: 'SHA1', label: 'SHA-1' },
  { key: 'SHA256', label: 'SHA-256' },
  { key: 'SHA512', label: 'SHA-512' },
];

function md5(input: string): string {
  function rotateLeft(x: number, n: number): number {
    return (x << n) | (x >>> (32 - n));
  }

  function toHex(uint32: number): string {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      hex += ((uint32 >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  }

  const s: number[] = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const K: number[] = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }

  const bytes = new TextEncoder().encode(input);
  const bits = bytes.length * 8;
  const padded = new Uint8Array((bits + 8 + 64 - ((bits + 8) % 64)) / 8 + 8);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, 0, true);
  dv.setUint32(padded.length - 4, bits, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let i = 0; i < padded.length; i += 64) {
    const M: number[] = [];
    for (let j = 0; j < 16; j++) {
      M[j] = dv.getUint32(i + j * 4, true);
    }

    let A = a0, B = b0, C = c0, D = d0;

    for (let j = 0; j < 64; j++) {
      let F: number, g: number;
      if (j < 16) {
        F = (B & C) | (~B & D);
        g = j;
      } else if (j < 32) {
        F = (D & B) | (~D & C);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        F = B ^ C ^ D;
        g = (3 * j + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * j) % 16;
      }

      F = (F + A + K[j] + M[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotateLeft(F, s[j])) >>> 0;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

async function shaHash(input: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<Algorithm[]>(['SHA256']);
  const [results, setResults] = useState<Record<Algorithm, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  function toggleAlgo(algo: Algorithm) {
    setSelected((prev) =>
      prev.includes(algo) ? prev.filter((a) => a !== algo) : [...prev, algo]
    );
  }

  async function handleGenerate() {
    setResults(null);
    const trimmed = input.trim();
    if (!trimmed) {
      toast.warning('Masukkan teks terlebih dahulu.');
      return;
    }
    if (selected.length === 0) {
      toast.warning('Pilih minimal satu algoritma hash.');
      return;
    }

    setLoading(true);
    try {
      const out: Record<string, string> = {};
      for (const algo of selected) {
        if (algo === 'MD5') {
          out[algo] = md5(trimmed);
        } else {
          const shaName = algo === 'SHA1' ? 'SHA-1' : algo === 'SHA256' ? 'SHA-256' : 'SHA-512';
          out[algo] = await shaHash(trimmed, shaName);
        }
      }
      setResults(out as Record<Algorithm, string>);
      toast.success('Hash berhasil dihasilkan!');
    } catch {
      toast.error('Gagal menghasilkan hash.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setInput('');
    setResults(null);
  }

  async function copyResult(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success('Hash berhasil disalin!');
  }

  const resultEntries = results ? Object.entries(results) : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Teks yang akan di-hash</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan teks di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[120px]"
          rows={4}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {ALGORITHMS.map((algo) => (
          <label key={algo.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(algo.key)}
              onChange={() => toggleAlgo(algo.key)}
              className="rounded text-indigo-600"
            />
            <span className="text-sm text-slate-700">{algo.label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleGenerate} loading={loading}>
          <Hash size={16} className="mr-1.5" /> Generate
        </Button>
        <Button variant="ghost" onClick={handleReset}><RotateCcw size={16} className="mr-1.5" /> Reset</Button>
      </div>

      {resultEntries.length > 0 && (
        <div className="space-y-3">
          {resultEntries.map(([algo, hash]) => (
            <div key={algo} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  {ALGORITHMS.find((a) => a.key === algo)?.label || algo}
                </span>
                <button
                  type="button"
                  onClick={() => copyResult(hash)}
                  className="text-slate-400 hover:text-indigo-600 transition"
                >
                  <Copy size={14} />
                </button>
              </div>
              <input
                readOnly
                value={hash}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-800 outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
