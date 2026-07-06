'use client';

import Link from 'next/link';
import { CategoryConfig } from '@/types/category';
import * as Icons from 'lucide-react';

interface MobileMenuProps {
  categories: CategoryConfig[];
  onClose: () => void;
}

export default function MobileMenu({ categories, onClose }: MobileMenuProps) {
  return (
    <div className="border-t border-slate-100 bg-white md:hidden">
      <div className="space-y-1 px-4 py-4">
        {categories.map((cat) => {
          const Icon = (Icons as any)[cat.icon] ?? Icons.Box;
          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              onClick={onClose}
            >
              <Icon size={16} />
              {cat.name}
            </Link>
          );
        })}
        <hr className="my-2 border-slate-100" />
        <Link href="/#popular-tools" className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={onClose}>
          Tools Populer
        </Link>
      </div>
    </div>
  );
}
