'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Download } from 'lucide-react';

function drawCode128(ctx: CanvasRenderingContext2D, text: string, width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000000';
  const chars = text.split('').map(c => c.charCodeAt(0));
  const barWidth = width / (chars.length * 11 + 20);
  let x = barWidth * 10;
  for (const char of chars) {
    const binary = char.toString(2).padStart(8, '0').replace(/0/g, '0').replace(/1/g, '1');
    const encoded = '1101' + binary + '1';
    for (let i = 0; i < encoded.length; i++) {
      if (encoded[i] === '1') {
        ctx.fillRect(x, height * 0.15, barWidth, height * 0.7);
      }
      x += barWidth;
    }
  }
}

export default function BarcodeGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 400;
    canvas.height = 150;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      drawCode128(ctx, text, canvas.width, canvas.height);
    } catch {
      // silent
    }
  }, [text]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'barcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    toast.success('Barcode berhasil diunduh!');
  }

  return (
    <div className="space-y-6">
      <Input
        label="Teks atau angka"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Masukkan teks untuk barcode"
      />

      {text.trim() && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <canvas ref={canvasRef} width={400} height={150} className="max-w-full" />
          </div>
          <Button onClick={handleDownload}>
            <Download size={16} className="mr-1.5" /> Download Barcode
          </Button>
        </div>
      )}
    </div>
  );
}
