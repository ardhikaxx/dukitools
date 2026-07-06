'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { CategoryConfig } from '@/types/category';
import * as Icons from 'lucide-react';

interface NavbarCategoryDropdownProps {
  categories: CategoryConfig[];
}

export default function NavbarCategoryDropdown({ categories }: NavbarCategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Kategori
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-slate-100 bg-white py-2 shadow-lg">
          {categories.map((cat) => {
            const Icon = (Icons as any)[cat.icon] ?? Icons.Box;
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <Icon size={16} />
                {cat.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
