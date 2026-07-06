'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { categoriesRegistry } from '@/lib/registry/categories-registry';
import NavbarCategoryDropdown from './NavbarCategoryDropdown';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          DukiTools
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavbarCategoryDropdown categories={categoriesRegistry} />
          <Link href="/#popular-tools" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Tools Populer
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/#search"
            aria-label="Cari tools"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <Search size={20} />
          </Link>
        </div>

        <button
          className="p-2 md:hidden"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && <MobileMenu categories={categoriesRegistry} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}
