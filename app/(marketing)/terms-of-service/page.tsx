import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';

const BASE_URL = 'https://dukitools.com';

export const metadata: Metadata = {
  title: 'Syarat Penggunaan DukiTools',
  description: 'Syarat dan ketentuan penggunaan layanan DukiTools.',
  alternates: { canonical: `${BASE_URL}/terms-of-service` },
  openGraph: {
    title: 'Syarat Penggunaan DukiTools',
    description: 'Syarat dan ketentuan penggunaan layanan DukiTools.',
    url: `${BASE_URL}/terms-of-service`,
    siteName: 'DukiTools',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Syarat Penggunaan DukiTools',
    description: 'Syarat dan ketentuan penggunaan layanan DukiTools.',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dukitools.com/' },
              { '@type': 'ListItem', position: 2, name: 'Syarat Penggunaan' },
            ],
          }),
        }}
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Syarat Penggunaan' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Syarat Penggunaan</h1>
      <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
        <p><strong>Terakhir diperbarui:</strong> 1 Januari 2025</p>
        <p>
          Dengan menggunakan DukiTools, Anda menyetujui syarat dan ketentuan berikut. Jika Anda tidak setuju, jangan gunakan layanan kami.
        </p>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">1. Penggunaan Wajar</h2>
        <p>
          Anda setuju untuk menggunakan DukiTools hanya untuk tujuan yang sah. Anda tidak diperbolehkan menggunakan layanan kami untuk:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Mengunggah, memproses, atau mendistribusikan konten ilegal.</li>
          <li>Melakukan scraping otomatis atau abuse sistem.</li>
          <li>Mengirimkan file yang mengandung malware, virus, atau kode berbahaya.</li>
        </ul>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">2. Batasan Tanggung Jawab</h2>
        <p>
          DukiTools menyediakan layanan &quot;sebagaimana adanya&quot; (as-is). Kami tidak menjamin bahwa:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hasil konversi atau kompresi akan sempurna 100% untuk semua jenis file.</li>
          <li>Layanan akan tersedia tanpa gangguan atau error.</li>
        </ul>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">3. Hak Kekayaan Intelektual</h2>
        <p>
          Seluruh konten, desain, dan kode DukiTools dilindungi hak cipta. Anda tidak diperbolehkan menyalin, memodifikasi, atau mendistribusikan ulang platform kami tanpa izin tertulis.
        </p>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">4. Perubahan</h2>
        <p>
          Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui halaman ini.
        </p>
      </div>
    </div>
  );
}
