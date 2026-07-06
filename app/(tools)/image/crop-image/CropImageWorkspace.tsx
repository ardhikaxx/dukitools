'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import ToolActions from '@/components/tools/ToolActions';
import { validateFile } from '@/lib/validators/file-validator';

export default function CropImageWorkspace({ tool }: { tool: ToolConfig }) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [cropWidth, setCropWidth] = useState('');
  const [cropHeight, setCropHeight] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const toast = useToast();

  function handleFilesAdded(files: File[]) {
    const f = files[0];
    if (!f) return;
    const validation = validateFile(f, {
      allowedExtensions: tool.acceptedFileTypes ?? [],
      allowedTypes: tool.acceptedMimeTypes ?? [],
      maxSizeBytes: (tool.maxFileSizeMB ?? 25) * 1024 * 1024,
    });
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setImageLoaded(false);
    setResultUrl(null);
    setX('');
    setY('');
    setCropWidth('');
    setCropHeight('');
  }

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function handleCrop() {
    const img = imageRef.current;
    if (!img) {
      toast.warning('Gambar belum dimuat.');
      return;
    }
    const cx = parseInt(x);
    const cy = parseInt(y);
    const cw = parseInt(cropWidth);
    const ch = parseInt(cropHeight);
    if (isNaN(cx) || isNaN(cy) || isNaN(cw) || isNaN(ch) || cw < 1 || ch < 1) {
      toast.warning('Masukkan koordinat dan dimensi yang valid.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Gagal memproses gambar.');
      return;
    }
    ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);
    const dataUrl = canvas.toDataURL();
    setResultUrl(dataUrl);
    toast.success('Gambar berhasil dipotong!');
  }

  function handleReset() {
    setFile(null);
    setImageUrl(null);
    setImageLoaded(false);
    setResultUrl(null);
    setX('');
    setY('');
    setCropWidth('');
    setCropHeight('');
  }

  function handleDownload() {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'cropped-image.png';
    a.click();
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <FileUpload
          onFilesSelected={handleFilesAdded}
          accept={tool.acceptedFileTypes?.join(',')}
          label="Seret & letakkan gambar di sini, atau klik untuk memilih"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={handleReset} className="text-xs text-red-500 hover:underline">Ganti</button>
          </div>

          {imageUrl && (
            <div className="overflow-auto rounded-xl border border-slate-200 bg-white p-2">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Preview"
                onLoad={() => setImageLoaded(true)}
                className="max-w-full h-auto"
              />
            </div>
          )}

          {imageLoaded && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Koordinat Potongan (px)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">X</label>
                  <input
                    type="number"
                    min={0}
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Y</label>
                  <input
                    type="number"
                    min={0}
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Lebar</label>
                  <input
                    type="number"
                    min={1}
                    value={cropWidth}
                    onChange={(e) => setCropWidth(e.target.value)}
                    placeholder="200"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Tinggi</label>
                  <input
                    type="number"
                    min={1}
                    value={cropHeight}
                    onChange={(e) => setCropHeight(e.target.value)}
                    placeholder="200"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button onClick={handleCrop} variant="primary" fullWidth>
                  Crop Image
                </Button>
              </div>
            </div>
          )}

          {resultUrl && (
            <div className="space-y-4">
              <div className="overflow-auto rounded-xl border border-slate-200 bg-white p-2">
                <img src={resultUrl} alt="Cropped result" className="max-w-full h-auto" />
              </div>
              <ToolActions
                downloadUrl={resultUrl}
                fileName="cropped-image.png"
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
