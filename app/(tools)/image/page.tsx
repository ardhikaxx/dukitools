import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ToolCard from '@/components/tools/ToolCard';
import { getToolsByCategory, getCategoryBySlug } from '@/lib/registry/registry-helpers';
import { generateCategoryMetadata } from '@/lib/utils/generateMetadata';
import { breadcrumbSchema } from '@/lib/seo/json-ld';
import { CategorySlug } from '@/types/tool';
import * as Icons from 'lucide-react';

const catSlug: CategorySlug = 'image';
const cat = getCategoryBySlug(catSlug);

export const metadata: Metadata = cat
  ? generateCategoryMetadata(cat.name, cat.description, cat.slug)
  : {};

export default function ImageCategoryPage() {
  const category = getCategoryBySlug('image');
  const tools = getToolsByCategory('image');
  if (!category) return notFound();
  const Icon = (Icons as any)[category.icon] ?? Icons.Box;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: category.name },
      ])) }} />
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
