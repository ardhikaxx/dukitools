'use client';

import { useState, useMemo } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function TextToSlugWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const toast = useToast();

  const slug = useMemo(() => toSlug(text), [text]);

  function handleReset() {
    setText('');
    toast.success('Teks berhasil direset.');
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik atau tempel teks di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[120px]"
          rows={4}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">URL Slug</label>
        <input
          type="text"
          value={slug}
          readOnly
          placeholder="slug-akan-muncul-di-sini"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-800 outline-none"
        />
      </div>

      <ToolActions textResult={slug} onReset={handleReset} />
    </div>
  );
}
