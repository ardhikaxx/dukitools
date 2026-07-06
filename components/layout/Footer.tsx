import Link from 'next/link';
import { categoriesRegistry } from '@/lib/registry/categories-registry';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="text-lg font-bold text-indigo-600">DukiTools</p>
          <p className="mt-2 text-sm text-slate-500">
            All Your Online Tools in One Place. Gratis, cepat, tanpa login.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">Kategori</p>
          <ul className="space-y-2 text-sm text-slate-500">
            {categoriesRegistry.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="hover:text-indigo-600 transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">Perusahaan</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/about" className="hover:text-indigo-600 transition-colors">Tentang Kami</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">Legal</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/privacy-policy" className="hover:text-indigo-600 transition-colors">Kebijakan Privasi</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-indigo-600 transition-colors">Syarat Penggunaan</Link></li>
            <li><Link href="/disclaimer" className="hover:text-indigo-600 transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        &copy; {year} DukiTools. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
