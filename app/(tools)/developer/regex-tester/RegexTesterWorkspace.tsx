'use client';

import { useState, useEffect } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { Play, RotateCcw, Search } from 'lucide-react';

interface MatchResult {
  full: string;
  groups: string[];
  index: number;
}

export default function RegexTesterWorkspace({ tool }: { tool: ToolConfig }) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gm');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function runTest() {
    setMatches([]);
    setMatchCount(0);
    setError(null);

    if (!pattern.trim()) {
      toast.warning('Masukkan regex pattern terlebih dahulu.');
      return;
    }
    if (!testString) {
      toast.warning('Masukkan test string terlebih dahulu.');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const results: MatchResult[] = [];
      let count = 0;
      let match: RegExpExecArray | null;

      if (flags.includes('g')) {
        const regexGlobal = new RegExp(pattern, flags);
        while ((match = regexGlobal.exec(testString)) !== null) {
          results.push({
            full: match[0],
            groups: match.slice(1),
            index: match.index,
          });
          count++;
          if (match.index === regexGlobal.lastIndex) regexGlobal.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            full: match[0],
            groups: match.slice(1),
            index: match.index,
          });
          count = 1;
        }
      }

      setMatches(results);
      setMatchCount(count);
      toast.success(`Ditemukan ${count} match.`);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Regex tidak valid.';
      setError(message);
      toast.error(message);
    }
  }

  useEffect(() => {
    if (pattern && testString) runTest();
  }, [pattern, flags, testString]);

  function handleReset() {
    setPattern('');
    setFlags('gm');
    setTestString('');
    setMatches([]);
    setMatchCount(0);
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Regex Pattern</label>
        <textarea
          value={pattern}
          onChange={(e) => { setPattern(e.target.value); setError(null); }}
          placeholder="Tulis regex pattern di sini (contoh: \d+)"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[80px]"
          rows={2}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Flags</label>
        <input
          type="text"
          value={flags}
          onChange={(e) => { setFlags(e.target.value); setError(null); }}
          placeholder="g, i, m, s, u, y"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => { setTestString(e.target.value); setError(null); }}
          placeholder="Masukkan teks yang akan diuji..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[150px]"
          rows={5}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={runTest}>
          <Search size={16} className="mr-1.5" /> Test
        </Button>
        <Button variant="ghost" onClick={handleReset}><RotateCcw size={16} className="mr-1.5" /> Reset</Button>
      </div>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {matchCount > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Ditemukan <span className="font-bold text-indigo-600">{matchCount}</span> match
          </p>
          <div className="max-h-80 overflow-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Match</th>
                  <th className="px-3 py-2">Position</th>
                  {matches.some((m) => m.groups.length > 0) && <th className="px-3 py-2">Groups</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {matches.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2 text-slate-800 break-all">{m.full}</td>
                    <td className="px-3 py-2 text-slate-500">{m.index}</td>
                    {m.groups.length > 0 && (
                      <td className="px-3 py-2 text-slate-500">{m.groups.join(', ')}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pattern && testString && matchCount === 0 && !error && (
        <p className="text-sm text-slate-500">Tidak ada match ditemukan.</p>
      )}
    </div>
  );
}
