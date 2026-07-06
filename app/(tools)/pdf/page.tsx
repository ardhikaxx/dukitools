import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ToolCard from '@/components/tools/ToolCard';
import { getToolsByCategory, getCategoryBySlug } from '@/lib/registry/registry-helpers';
import { CategorySlug } from '@/types/tool';
import * as Icons from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDF Tools — Gratis & Tanpa Login',
  description: 'Kumpulan tools PDF gratis: merge, split, compress, konversi, dan edit PDF online tanpa login.',
};

export default function PdfCategoryPage() {
  const category = getCategoryBySlug('pdf');
  const tools = getToolsByCategory('pdf');
  if (!category) return notFound();
  const Icon = (Icons as any)[category.icon] ?? Icons.Box;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: category.name }]} />
      <div className="mb-8 flex items-center gap-4">
        <div className={`rounded-2xl p-4 ${category.colorClass}`}>
          <Icon size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
          <p className="mt-1 text-slate-500">{category.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
