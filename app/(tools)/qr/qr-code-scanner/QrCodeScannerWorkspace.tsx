'use client';

import { useState, useRef } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import ToolActions from '@/components/tools/ToolActions';

export default function QrCodeScannerWorkspace({ tool }: { tool: ToolConfig }) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  function handleFilesAdded(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
    setResult(null);
    decodeQrCode(url);
  }

  async function decodeQrCode(url: string) {
    setLoading(true);
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        import('jsqr').then((jsqr) => {
          const code = jsqr.default(imageData.data, imageData.width, imageData.height);
          if (code) {
            setResult(code.data);
            toast.success('QR Code decoded successfully!');
          } else {
            setResult(null);
            toast.warning('Could not decode QR code. Try a clearer image.');
          }
          setLoading(false);
        });
      };
      img.onerror = () => {
        setLoading(false);
        toast.error('Failed to load image.');
      };
      img.src = url;
    } catch {
      setLoading(false);
      toast.error('Failed to decode QR code.');
    }
  }

  function handleReset() {
    setFile(null);
    setImageUrl(null);
    setResult(null);
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <FileUpload
          onFilesSelected={handleFilesAdded}
          accept=".png,.jpg,.jpeg,.gif,.webp"
          label="Upload QR code image (PNG, JPG, WEBP)"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={handleReset} className="text-xs text-red-500 hover:underline">Change</button>
          </div>

          {imageUrl && (
            <div className="flex justify-center rounded-xl border border-slate-200 bg-white p-4">
              <img src={imageUrl} alt="QR Code" className="max-h-64 object-contain" />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {loading && <p className="text-center text-sm text-slate-500">Decoding QR code...</p>}

          {result && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-green-50 p-4">
                <p className="text-xs text-green-600 font-medium mb-1">Decoded Result</p>
                <p className="font-mono text-sm text-slate-800 break-all">{result}</p>
              </div>
              <ToolActions textResult={result} onReset={handleReset} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
