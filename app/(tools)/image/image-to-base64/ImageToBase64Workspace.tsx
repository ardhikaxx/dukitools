'use client';

import { useState, useEffect } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { Copy, RotateCcw } from 'lucide-react';

export default function ImageToBase64Workspace({ tool }: { tool: ToolConfig }) {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    return () => { if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  function handleFilesAdded(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    const reader = new FileReader();
    reader.onload = () => {
      setBase64(reader.result as string);
      toast.success('Image converted to Base64!');
    };
    reader.onerror = () => toast.error('Failed to read file.');
    reader.readAsDataURL(f);
  }

  async function handleCopy() {
    if (!base64) return;
    await navigator.clipboard.writeText(base64);
    toast.success('Base64 copied!');
  }

  function handleReset() {
    setFile(null);
    setBase64(null);
    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <FileUpload
          onFilesSelected={handleFilesAdded}
          accept="image/*"
          label="Upload any image"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB | {file.type}</p>
            </div>
            <button onClick={handleReset} className="text-xs text-red-500 hover:underline">Change</button>
          </div>

          {previewUrl && (
            <div className="flex justify-center rounded-xl border border-slate-200 bg-white p-2">
              <img src={previewUrl} alt="Preview" className="max-h-48 object-contain" />
            </div>
          )}

          {base64 && (
            <>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500 mb-1">Format: {file?.type || 'unknown'}</p>
                <p className="text-xs text-slate-500 mb-1">Size: {((base64.length * 3) / 4 / 1024).toFixed(1)} KB (base64)</p>
                <p className="text-xs text-slate-500 mb-2">Preview (first 100 chars):</p>
                <p className="font-mono text-xs text-slate-700 bg-white rounded border border-slate-100 p-2 break-all max-h-24 overflow-y-auto">
                  {base64.substring(0, 100)}...
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="primary" onClick={handleCopy}>
                  <Copy size={16} className="mr-1.5" /> Copy Base64
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  <RotateCcw size={16} className="mr-1.5" /> Reset
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
