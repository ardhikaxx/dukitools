'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import Button from '@/components/ui/Button';
import { Copy, RotateCcw, Sparkles } from 'lucide-react';

function generateUuidV4(): string {
  const hex = '0123456789abcdef';
  let uuid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4';
    } else if (i === 19) {
      uuid += hex[(Math.random() * 4) | 8];
    } else {
      uuid += hex[(Math.random() * 16) | 0];
    }
  }
  return uuid;
}

export default function UuidGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [dashes, setDashes] = useState(true);
  const [output, setOutput] = useState('');
  const toast = useToast();

  function handleGenerate() {
    const uuids: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let uuid = generateUuidV4();
      if (!dashes) uuid = uuid.replace(/-/g, '');
      if (uppercase) uuid = uuid.toUpperCase();
      uuids.push(uuid);
    }
    setOutput(uuids.join('\n'));
    toast.success(`${quantity} UUID berhasil dihasilkan!`);
  }

  function handleReset() {
    setQuantity(1);
    setUppercase(false);
    setDashes(true);
    setOutput('');
  }

  async function handleCopy() {
    if (!output) {
      toast.warning('Belum ada UUID untuk disalin.');
      return;
    }
    await navigator.clipboard.writeText(output);
    toast.success('UUID berhasil disalin!');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Jumlah (1-100)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={() => setUppercase(!uppercase)}
              className="rounded text-indigo-600"
            />
            <span className="text-sm text-slate-700">Uppercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dashes}
              onChange={() => setDashes(!dashes)}
              className="rounded text-indigo-600"
            />
            <span className="text-sm text-slate-700">Dashes</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleGenerate}>
          <Sparkles size={16} className="mr-1.5" /> Generate UUID
        </Button>
        <Button onClick={handleCopy}>
          <Copy size={16} className="mr-1.5" /> Copy All
        </Button>
        <Button variant="ghost" onClick={handleReset}><RotateCcw size={16} className="mr-1.5" /> Reset</Button>
      </div>

      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Hasil UUID</label>
          <textarea
            readOnly
            value={output}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-800 outline-none resize-y min-h-[120px]"
            rows={Math.min(quantity, 10)}
          />
        </div>
      )}
    </div>
  );
}
