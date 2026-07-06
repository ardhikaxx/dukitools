import Link from 'next/link';
import { CategoryConfig } from '@/types/category';
import { getToolCountByCategory } from '@/lib/registry/registry-helpers';
import * as Icons from 'lucide-react';

export default function CategoryCards({ categories }: { categories: CategoryConfig[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Jelajahi Kategori</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => {
          const Icon = (Icons as any)[cat.icon] ?? Icons.Box;
          const count = getToolCountByCategory(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group rounded-2xl border border-slate-100 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"
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
    </section>
  );
}
