'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { RotateCw, RotateCcw } from 'lucide-react';
import ToolActions from '@/components/tools/ToolActions';

export default function RotateImageWorkspace({ tool }: { tool: ToolConfig }) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const toast = useToast();

  useEffect(() => {
    return () => { if (imageUrl) URL.revokeObjectURL(imageUrl); if (resultUrl) URL.revokeObjectURL(resultUrl); };
  }, [imageUrl, resultUrl]);

  function handleFilesAdded(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setRotation(0);
    setResultUrl(null);
  }

  function processRotation(angle: number) {
    const img = imgRef.current;
    if (!img || !canvasRef.current) return;
    const newRotation = (rotation + angle) % 360;
    setRotation(newRotation);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isSideways = newRotation % 180 !== 0;
    canvas.width = isSideways ? img.naturalHeight : img.naturalWidth;
    canvas.height = isSideways ? img.naturalWidth : img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((newRotation * Math.PI) / 180);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    setResultUrl(canvas.toDataURL('image/png'));
    toast.success(`Rotated ${angle}°`);
  }

  function handleReset() {
    setFile(null);
    setImageUrl(null);
    setRotation(0);
    setResultUrl(null);
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <FileUpload
          onFilesSelected={handleFilesAdded}
          accept=".jpg,.jpeg,.png,.webp"
          label="Upload image (JPG, PNG, WEBP)"
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
            <img ref={imgRef} src={imageUrl} alt="Original" className="hidden" onLoad={() => processRotation(0)} />
          )}

          <canvas ref={canvasRef} className="hidden" />

          {resultUrl && (
            <div className="overflow-auto rounded-xl border border-slate-200 bg-white p-2">
              <img src={resultUrl} alt="Rotated result" className="max-w-full h-auto" />
            </div>
          )}

          <div className="flex justify-center gap-3 flex-wrap">
            <Button variant="secondary" onClick={() => processRotation(90)}>
              <RotateCw size={16} className="mr-1.5" /> 90° CW
            </Button>
            <Button variant="secondary" onClick={() => processRotation(-90)}>
              <RotateCcw size={16} className="mr-1.5" /> 90° CCW
            </Button>
            <Button variant="secondary" onClick={() => processRotation(180)}>
              180°
            </Button>
          </div>

          {resultUrl && (
            <ToolActions downloadUrl={resultUrl} fileName="rotated-image.png" onReset={handleReset} />
          )}
        </div>
      )}
    </div>
  );
}
