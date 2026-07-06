'use client';

import { Download, Copy, RotateCcw, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import { useToast } from '@/components/toast/toastStore';

interface ResultCardProps {
  title: string;
  downloadUrl?: string;
  fileName?: string;
  sizeInfo?: string;
  textResult?: string;
  onReset: () => void;
}

export default function ResultCard({ title, downloadUrl, fileName, sizeInfo, textResult, onReset }: ResultCardProps) {
  const toast = useToast();

  async function handleCopy() {
    if (!textResult) return;
    await navigator.clipboard.writeText(textResult);
    toast.success('Hasil berhasil disalin ke clipboard!');
  }

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 text-center">
      <CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={32} />
      <p className="font-semibold text-slate-800">{title}</p>
      {sizeInfo && <p className="text-sm text-slate-500">{sizeInfo}</p>}

      {textResult && (
        <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-white p-4 text-left text-sm whitespace-pre-wrap">{textResult}</pre>
      )}

      <div className="mt-4 flex justify-center gap-3 flex-wrap">
        {downloadUrl && (
          <a href={downloadUrl} download={fileName}>
            <Button variant="primary"><Download size={16} className="mr-1.5" /> Download</Button>
          </a>
        )}
        {textResult && (
          <Button variant="secondary" onClick={handleCopy}><Copy size={16} className="mr-1.5" /> Copy</Button>
        )}
        <Button variant="ghost" onClick={onReset}><RotateCcw size={16} className="mr-1.5" /> Reset</Button>
      </div>
    </div>
  );
}
