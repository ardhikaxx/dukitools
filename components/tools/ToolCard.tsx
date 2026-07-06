import Link from 'next/link';
import { ToolConfig } from '@/types/tool';
import * as Icons from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface ToolCardProps {
  tool: ToolConfig;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = (Icons as any)[tool.icon] ?? Icons.Box;

  return (
    <Link
      href={`/${tool.category}/${tool.slug}`}
      className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
              {tool.name}
            </p>
            {tool.isNew && <Badge variant="success">Baru</Badge>}
            {tool.isPopular && <Badge variant="info">Populer</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">{tool.shortDescription}</p>
          <p className="mt-2 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Buka Tool &rarr;
          </p>
        </div>
      </div>
    </Link>
  );
}
