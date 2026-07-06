import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';

export const metadata: Metadata = {
  title: 'Tentang DukiTools',
  description: 'Pelajari lebih lanjut tentang DukiTools — platform online tools gratis tanpa login.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Tentang Kami' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Tentang DukiTools</h1>
      <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
        <p>
          DukiTools lahir dari satu misi sederhana: <strong>menyediakan semua online tools yang Anda butuhkan dalam satu tempat, tanpa hambatan</strong> — tanpa login, tanpa registrasi, tanpa biaya.
        </p>
        <p>
          Kami percaya bahwa alat-alat digital dasar seperti konversi PDF, kompresi gambar, formatter kode, dan generator password seharusnya dapat diakses oleh siapa saja, kapan saja, tanpa perlu membuat akun atau memberikan data pribadi.
        </p>
        <p>
          Setiap tool di DukiTools dirancang dengan prinsip:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Gratis selamanya</strong> — tidak ada biaya tersembunyi, tidak ada batasan harian.</li>
          <li><strong>Privasi adalah prioritas</strong> — file Anda diproses sementara dan otomatis dihapus. Tidak ada yang disimpan permanen.</li>
          <li><strong>Tanpa login</strong> — buka situs, pilih tool, selesai. Tidak perlu registrasi.</li>
          <li><strong>100% online</strong> — tidak perlu instalasi software. Cukup browser dan koneksi internet.</li>
        </ul>
        <p>
          Saat ini DukiTools memiliki puluhan tools dalam 9 kategori, dan terus bertambah. Setiap tool dibangun dengan standar kualitas yang sama: cepat, akurat, dan mudah digunakan.
        </p>
      </div>
    </div>
  );
}
