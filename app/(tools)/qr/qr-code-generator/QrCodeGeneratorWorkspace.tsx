'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Download } from 'lucide-react';

export default function QrCodeGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) return;
    import('qrcode').then((QRCode) => {
      QRCode.toCanvas(canvasRef.current, text.trim(), {
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }, (err: Error | null | undefined) => {
        if (err) toast.error('Gagal membuat QR Code.');
      });
    });
  }, [text, size, toast]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    toast.success('QR Code berhasil diunduh!');
  }

  return (
    <div className="space-y-6">
      <Input
        label="Teks atau URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="https://contoh.com atau teks apapun"
      />
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Ukuran</label>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
        >
          <option value={128}>Kecil (128px)</option>
          <option value={256}>Sedang (256px)</option>
          <option value={512}>Besar (512px)</option>
          <option value={1024}>Sangat Besar (1024px)</option>
        </select>
      </div>

      {text.trim() && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm inline-block">
            <canvas ref={canvasRef} />
          </div>
          <Button onClick={handleDownload}>
            <Download size={16} className="mr-1.5" /> Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
}
