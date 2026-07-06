'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import Input from '@/components/ui/Input';
import ToolActions from '@/components/tools/ToolActions';

const algorithms = [
  { value: 'MD5', label: 'MD5' },
  { value: 'SHA-1', label: 'SHA-1' },
  { value: 'SHA-256', label: 'SHA-256' },
  { value: 'SHA-512', label: 'SHA-512' },
];

async function computeHash(file: File, algorithm: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function FileHashCheckerWorkspace({ tool }: { tool: ToolConfig }) {
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expectedHash, setExpectedHash] = useState('');
  const toast = useToast();

  function handleFilesAdded(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setHash(null);
    setExpectedHash('');
    computeHashForFile(f, algorithm);
  }

  async function computeHashForFile(f: File, algo: string) {
    setLoading(true);
    try {
      const result = await computeHash(f, algo);
      setHash(result);
      toast.success('Hash computed!');
    } catch {
      toast.error('Failed to compute hash.');
    }
    setLoading(false);
  }

  function handleAlgorithmChange(algo: string) {
    setAlgorithm(algo);
    if (file) computeHashForFile(file, algo);
  }

  function handleReset() {
    setFile(null);
    setHash(null);
    setAlgorithm('SHA-256');
    setExpectedHash('');
  }

  const match = hash && expectedHash ? (hash === expectedHash.trim().toLowerCase() ? 'match' : 'no-match') : null;

  return (
    <div className="space-y-4">
      {!file ? (
        <FileUpload
          onFilesSelected={handleFilesAdded}
          accept=".*"
          label="Upload any file"
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

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => handleAlgorithmChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {algorithms.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          {loading && <p className="text-center text-sm text-slate-500">Computing hash...</p>}

          {hash && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500 mb-1">{algorithm} Hash</p>
              <p className="font-mono text-sm text-slate-800 break-all">{hash}</p>
              <ToolActions textResult={hash} onReset={handleReset} />
            </div>
          )}

          <div>
            <Input
              label="Expected Hash (optional)"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste hash to compare"
            />
          </div>

          {match === 'match' && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
              <p className="text-green-700 font-medium">✓ Hash matches!</p>
            </div>
          )}
          {match === 'no-match' && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
              <p className="text-red-700 font-medium">✗ Hash does NOT match!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
