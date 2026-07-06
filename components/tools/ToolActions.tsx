'use client';

import { Download, Copy, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/toast/toastStore';

interface ToolActionsProps {
  downloadUrl?: string;
  fileName?: string;
  textResult?: string;
  onReset: () => void;
}

export default function ToolActions({ downloadUrl, fileName, textResult, onReset }: ToolActionsProps) {
  const toast = useToast();

  async function handleCopy() {
    if (!textResult) return;
    await navigator.clipboard.writeText(textResult);
    toast.success('Hasil berhasil disalin ke clipboard!');
  }

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {downloadUrl && (
        <a href={downloadUrl} download={fileName}>
          <Button variant="primary">
            <Download size={16} className="mr-1.5" /> Download
          </Button>
        </a>
      )}
      {textResult && (
        <Button variant="secondary" onClick={handleCopy}>
          <Copy size={16} className="mr-1.5" /> Copy
        </Button>
      )}
      <Button variant="ghost" onClick={onReset}>
        <RotateCcw size={16} className="mr-1.5" /> Reset
      </Button>
    </div>
  );
}
