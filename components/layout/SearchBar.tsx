'use client';

import { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { useToolSearch } from '@/hooks/useToolSearch';
import Link from 'next/link';

export default function SearchBar() {
  const { query, setQuery, results } = useToolSearch();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Cari tools..."
        className="w-48 rounded-full border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        aria-label="Cari tools"
        role="combobox"
        aria-expanded={focused && results.length > 0}
      />

      {focused && results.length > 0 && (
        <ul className="absolute right-0 z-10 mt-2 w-80 rounded-xl border border-slate-100 bg-white py-2 shadow-lg">
          {results.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/${tool.category}/${tool.slug}`}
                className="flex flex-col px-4 py-2 hover:bg-slate-50"
              >
                <span className="font-medium text-slate-800">{tool.name}</span>
                <span className="text-xs text-slate-400">{tool.shortDescription}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
