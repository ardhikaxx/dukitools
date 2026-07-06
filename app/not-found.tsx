import Link from 'next/link';
import { Search } from 'lucide-react';
import { getPopularTools } from '@/lib/registry/registry-helpers';

export default function NotFound() {
  const popularTools = getPopularTools(4);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="text-6xl font-bold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-slate-500">Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.</p>

      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>

      {popularTools.length > 0 && (
        <div className="mt-12">
          <p className="mb-4 text-sm font-medium text-slate-600">Atau coba tools populer berikut:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularTools.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.category}/${t.slug}`}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
