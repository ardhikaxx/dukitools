'use client';

import { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { useToolSearch } from '@/hooks/useToolSearch';
import Link from 'next/link';

export default function HeroSection() {
  const { query, setQuery, results } = useToolSearch();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section id="search" className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
        All Your Online Tools <span className="text-indigo-600">in One Place</span>
      </h1>
      <p className="mt-4 text-lg text-slate-500">
        Gratis, tanpa login, tanpa registrasi. Langsung pakai.
      </p>

      <div className="relative mx-auto mt-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Cari tools, misal: compress pdf, json formatter..."
          className="w-full rounded-full border border-slate-200 py-4 pl-12 pr-4 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          aria-label="Cari tools"
          aria-expanded={focused && results.length > 0}
          role="combobox"
        />

        {focused && results.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full rounded-xl border border-slate-100 bg-white py-2 text-left shadow-lg">
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
    </section>
  );
}
