'use client';

import { useState, useMemo } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';

interface TextStats {
  words: number;
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
}

function computeStats(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
  const wordCount = words || 1;
  const readingMinutes = wordCount / 200;
  const speakingMinutes = wordCount / 150;
  const readingTime = readingMinutes < 1 ? '< 1 menit' : `${Math.ceil(readingMinutes)} menit`;
  const speakingTime = speakingMinutes < 1 ? '< 1 menit' : `${Math.ceil(speakingMinutes)} menit`;
  return { words, charsWithSpaces, charsWithoutSpaces, sentences, paragraphs, readingTime, speakingTime };
}

export default function WordCounterWorkspace({ tool }: { tool: ToolConfig }) {
  const [text, setText] = useState('');
  const toast = useToast();

  const stats = useMemo(() => computeStats(text), [text]);

  function handleReset() {
    setText('');
    toast.success('Teks berhasil direset.');
  }

  const cards = [
    { label: 'Kata', value: stats.words },
    { label: 'Karakter (dengan spasi)', value: stats.charsWithSpaces },
    { label: 'Karakter (tanpa spasi)', value: stats.charsWithoutSpaces },
    { label: 'Kalimat', value: stats.sentences },
    { label: 'Paragraf', value: stats.paragraphs },
    { label: 'Estimasi Waktu Baca', value: stats.readingTime },
    { label: 'Estimasi Waktu Bicara', value: stats.speakingTime },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ketik atau tempel teks di sini..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[200px]"
        rows={8}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <ToolActions textResult={text} onReset={handleReset} />
    </div>
  );
}
