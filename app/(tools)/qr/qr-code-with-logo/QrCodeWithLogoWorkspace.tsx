'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Download, RotateCcw } from 'lucide-react';

export default function QrCodeWithLogoWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) return;
    const canvas = canvasRef.current;
    import('qrcode').then((QRCode) => {
      QRCode.toCanvas(canvas, text.trim(), {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#ffffff' },
      }, (err: Error | null | undefined) => {
        if (err) { toast.error('Failed to generate QR Code.'); return; }
        if (logoUrl) {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const logo = new Image();
          logo.onload = () => {
            const size = canvas.width * 0.2;
            const x = (canvas.width - size) / 2;
            const y = (canvas.height - size) / 2;
            ctx.fillStyle = 'white';
            ctx.fillRect(x - 4, y - 4, size + 8, size + 8);
            ctx.drawImage(logo, x, y, size, size);
          };
          logo.src = logoUrl;
        }
      });
    });
  }, [text, logoUrl, toast]);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoUrl(URL.createObjectURL(f));
  }

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode-with-logo.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    toast.success('QR Code downloaded!');
  }

  function handleReset() {
    setText('');
    setLogoFile(null);
    setLogoUrl(null);
  }

  return (
    <div className="space-y-4">
      <Input
        label="Text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="https://example.com"
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Logo (optional)</label>
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoUpload} className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100" />
      </div>

      {text.trim() && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm inline-block">
            <canvas ref={canvasRef} width={400} height={400} />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleDownload}>
              <Download size={16} className="mr-1.5" /> Download
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw size={16} className="mr-1.5" /> Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
