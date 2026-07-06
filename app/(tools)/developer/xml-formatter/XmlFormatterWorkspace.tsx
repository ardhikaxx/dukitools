'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ResultCard from '@/components/ui/ResultCard';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { Braces, Minus, Maximize2 } from 'lucide-react';

function formatXml(xml: string): string {
  const trimmed = xml.trim();
  const result: string[] = [];
  let indent = 0;
  const indentStr = '  ';

  const parts = trimmed.split(/(<\/?[^>]+>)/g).filter(Boolean);

  for (const part of parts) {
    if (part.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      result.push(indentStr.repeat(indent) + part);
    } else if (part.startsWith('<')) {
      const isSelfClosing = part.endsWith('/>');
      const isComment = part.startsWith('<!--');
      const isCdata = part.startsWith('<![CDATA[');
      const isPI = part.startsWith('<?');
      if (!isComment && !isCdata && !isSelfClosing && !isPI) {
        result.push(indentStr.repeat(indent) + part);
        indent++;
      } else {
        result.push(indentStr.repeat(indent) + part);
      }
    } else if (part.trim()) {
      result.push(indentStr.repeat(indent) + part.trim());
    }
  }

  return result.join('\n');
}

function minifyXml(xml: string): string {
  return xml
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim();
}

export default function XmlFormatterWorkspace({ tool }: { tool: ToolConfig }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function handleFormat() {
    setOutput('');
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      toast.warning('Masukkan XML terlebih dahulu.');
      return;
    }
    try {
      setOutput(formatXml(trimmed));
      toast.success('XML berhasil diformat!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal memformat XML.';
      setError(message);
      toast.error(message);
    }
  }

  function handleMinify() {
    setOutput('');
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      toast.warning('Masukkan XML terlebih dahulu.');
      return;
    }
    try {
      setOutput(minifyXml(trimmed));
      toast.success('XML berhasil diminify!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal meminify XML.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setInput('');
    setOutput('');
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input XML</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder="Tempel kode XML Anda di sini..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
          rows={8}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleFormat}>
          <Maximize2 size={16} className="mr-1.5" /> Format (Beautify)
        </Button>
        <Button variant="secondary" onClick={handleMinify}>
          <Minus size={16} className="mr-1.5" /> Minify
        </Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {output && (
        <ResultCard
          title="Hasil XML"
          textResult={output}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
