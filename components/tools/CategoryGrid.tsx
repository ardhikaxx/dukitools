import Link from 'next/link';
import { CategoryConfig } from '@/types/category';
import { getToolCountByCategory } from '@/lib/registry/registry-helpers';
import * as Icons from 'lucide-react';

interface CategoryGridProps {
  categories: CategoryConfig[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {categories.map((cat) => {
        const Icon = (Icons as any)[cat.icon] ?? Icons.Box;
        const count = getToolCountByCategory(cat.slug);
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="group rounded-2xl border border-slate-100 p-5 transition hover:border-indigo-200 hover:shadow-md bg-white"
          >
            <div className={`mb-3 inline-flex rounded-xl p-3 ${cat.colorClass}`}>
              <Icon size={22} />
            </div>
            <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{cat.name}</p>
            <p className="text-xs text-slate-400">{count} tools</p>
          </Link>
        );
      })}
    </div>
  );
}
