'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';
import Button from '@/components/ui/Button';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
  'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui',
  'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

function generateSentence(wordCount: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(sentenceCount: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(Math.floor(Math.random() * 10) + 5));
  }
  return sentences.join(' ');
}

function generateLoremIpsum(paragraphs: number): string {
  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    result.push(generateParagraph(Math.floor(Math.random() * 4) + 3));
  }
  return result.join('\n\n');
}

export default function LoremIpsumGeneratorWorkspace({ tool }: { tool: ToolConfig }) {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');
  const toast = useToast();

  function handleGenerate() {
    const count = Math.min(Math.max(paragraphs, 1), 20);
    setParagraphs(count);
    const text = generateLoremIpsum(count);
    setOutput(text);
    toast.success(`${count} paragraf Lorem Ipsum berhasil dibuat!`);
  }

  function handleReset() {
    setParagraphs(3);
    setOutput('');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Jumlah Paragraf (1-20)
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={paragraphs}
            onChange={(e) => setParagraphs(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 20))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <Button onClick={handleGenerate} variant="primary">
          Generate
        </Button>
      </div>

      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Hasil</label>
          <textarea
            readOnly
            value={output}
            rows={10}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none resize-y"
          />
          <div className="mt-3">
            <ToolActions textResult={output} onReset={handleReset} />
          </div>
        </div>
      )}
    </div>
  );
}
