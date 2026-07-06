import { Zap, Lock, Smile, Globe } from 'lucide-react';

const values = [
  { icon: Zap, title: 'Super Cepat', description: 'Tool client-side bekerja instan di browser Anda tanpa perlu menunggu server.' },
  { icon: Lock, title: 'Aman & Privasi', description: 'File Anda otomatis dihapus setelah diproses. Tidak ada penyimpanan permanen.' },
  { icon: Smile, title: 'Tanpa Login', description: 'Tidak perlu registrasi atau login. Buka langsung pakai.' },
  { icon: Globe, title: 'Akses di Mana Saja', description: 'Bisa digunakan di perangkat apa pun dengan koneksi internet.' },
];

export default function ValueProposition() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">Mengapa DukiTools?</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Icon size={28} />
              </div>
              <h3 className="font-semibold text-slate-800">{v.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{v.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
