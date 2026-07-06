'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { MoveHorizontal, MoveVertical } from 'lucide-react';
import ToolActions from '@/components/tools/ToolActions';

export default function FlipImageWorkspace({ tool }: { tool: ToolConfig }) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
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
    setFlipH(false);
    setFlipV(false);
    setResultUrl(null);
  }

  function applyFlip(horizontal: boolean, vertical: boolean) {
    const img = imgRef.current;
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(horizontal ? canvas.width : 0, vertical ? canvas.height : 0);
    ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
    ctx.drawImage(img, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    setResultUrl(canvas.toDataURL('image/png'));
  }

  function handleFlipH() {
    const nv = !flipH;
    setFlipH(nv);
    applyFlip(nv, flipV);
    toast.success('Flipped horizontally');
  }

  function handleFlipV() {
    const nv = !flipV;
    setFlipV(nv);
    applyFlip(flipH, nv);
    toast.success('Flipped vertically');
  }

  function handleReset() {
    setFile(null);
    setImageUrl(null);
    setResultUrl(null);
    setFlipH(false);
    setFlipV(false);
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
            <img ref={imgRef} src={imageUrl} alt="Original" className="hidden" onLoad={() => applyFlip(false, false)} />
          )}

          <canvas ref={canvasRef} className="hidden" />

          {resultUrl && (
            <div className="overflow-auto rounded-xl border border-slate-200 bg-white p-2">
              <img src={resultUrl} alt="Flipped result" className="max-w-full h-auto" />
            </div>
          )}

          <div className="flex justify-center gap-3 flex-wrap">
            <Button variant={flipH ? 'primary' : 'secondary'} onClick={handleFlipH}>
              <MoveHorizontal size={16} className="mr-1.5" /> Flip Horizontal
            </Button>
            <Button variant={flipV ? 'primary' : 'secondary'} onClick={handleFlipV}>
              <MoveVertical size={16} className="mr-1.5" /> Flip Vertical
            </Button>
          </div>

          {resultUrl && (
            <ToolActions downloadUrl={resultUrl} fileName="flipped-image.png" onReset={handleReset} />
          )}
        </div>
      )}
    </div>
  );
}
