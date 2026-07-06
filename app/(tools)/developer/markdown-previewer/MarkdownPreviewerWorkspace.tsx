'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToast } from '@/components/toast/toastStore';
import ToolActions from '@/components/tools/ToolActions';

const PLACEHOLDER = `# Heading 1

## Heading 2

This is **bold** and *italic* text.

- List item 1
- List item 2
- List item 3

\`inline code\`

[Visit OpenAI](https://openai.com)`;

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>');

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (/^-\s/.test(line)) {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(`<li>${line.replace(/^-\s/, '')}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      if (line.trim() === '') { result.push('<br/>'); }
      else if (!/^<h[1-6]/.test(line) && !/^<li/.test(line)) { result.push(`<p>${line}</p>`); }
      else { result.push(line); }
    }
  }
  if (inList) result.push('</ul>');

  return result.join('\n');
}

export default function MarkdownPreviewerWorkspace({ tool }: { tool: ToolConfig }) {
  const [markdown, setMarkdown] = useState(PLACEHOLDER);
  const toast = useToast();

  const html = renderMarkdown(markdown);

  function handleReset() {
    setMarkdown(PLACEHOLDER);
    toast.success('Markdown berhasil direset.');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Markdown Input</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Ketik Markdown di sini..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y min-h-[400px]"
            rows={16}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Preview</label>
          <div
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm overflow-auto min-h-[400px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <ToolActions textResult={markdown} onReset={handleReset} />
    </div>
  );
}
