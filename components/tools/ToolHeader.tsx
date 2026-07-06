import { ToolConfig } from '@/types/tool';
import { CheckCircle2 } from 'lucide-react';

export default function ToolHeader({ tool }: { tool: ToolConfig }) {
  return (
    <header>
      <h1 className="text-3xl font-bold text-slate-900">{tool.name}</h1>
      <p className="mt-2 text-slate-600 leading-relaxed">{tool.description}</p>
      <ul className="mt-4 space-y-1.5">
        {tool.benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}
