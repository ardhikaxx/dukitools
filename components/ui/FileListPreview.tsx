'use client';

import { X, GripVertical, File } from 'lucide-react';
import { formatBytes } from '@/lib/utils/formatBytes';

interface FileListPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  onReorder?: (files: File[]) => void;
}

export default function FileListPreview({ files, onRemove, onReorder }: FileListPreviewProps) {
  function moveFile(from: number, direction: -1 | 1) {
    if (!onReorder) return;
    const to = from + direction;
    if (to < 0 || to >= files.length) return;
    const newFiles = [...files];
    [newFiles[from], newFiles[to]] = [newFiles[to], newFiles[from]];
    onReorder(newFiles);
  }

  return (
    <div className="space-y-2">
      {files.map((file, i) => (
        <div key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm">
          {onReorder && (
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-30 text-xs leading-none">▲</button>
              <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-30 text-xs leading-none">▼</button>
            </div>
          )}
          <File size={18} className="shrink-0 text-slate-400" />
          <span className="flex-1 truncate text-slate-700">{file.name}</span>
          <span className="shrink-0 text-xs text-slate-400">{formatBytes(file.size)}</span>
          <button onClick={() => onRemove(i)} aria-label={`Hapus ${file.name}`} className="text-slate-300 hover:text-red-500">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
