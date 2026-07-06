import { ToolConfig } from '@/types/tool';
import ToolCard from './ToolCard';

interface RelatedToolsProps {
  tools: ToolConfig[];
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools.length) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-slate-900">Tools Terkait</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
