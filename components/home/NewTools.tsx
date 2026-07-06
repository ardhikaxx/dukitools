import { ToolConfig } from '@/types/tool';
import ToolCard from '@/components/tools/ToolCard';

interface NewToolsProps {
  tools: ToolConfig[];
}

export default function NewTools({ tools }: NewToolsProps) {
  if (!tools.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Tools Baru</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
