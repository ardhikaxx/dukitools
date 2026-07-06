import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';

const BASE_URL = 'https://dukitools.com';

export const metadata: Metadata = {
  title: 'Disclaimer DukiTools',
  description: 'Disclaimer dan batasan tanggung jawab penggunaan layanan DukiTools.',
  alternates: { canonical: `${BASE_URL}/disclaimer` },
  openGraph: {
    title: 'Disclaimer DukiTools',
    description: 'Disclaimer dan batasan tanggung jawab penggunaan layanan DukiTools.',
    url: `${BASE_URL}/disclaimer`,
    siteName: 'DukiTools',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disclaimer DukiTools',
    description: 'Disclaimer dan batasan tanggung jawab penggunaan layanan DukiTools.',
  },
};

export default function DisclaimerPage() {
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
              { '@type': 'ListItem', position: 2, name: 'Disclaimer' },
            ],
          }),
        }}
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Disclaimer' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Disclaimer</h1>
      <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
        <h2 className="text-xl font-semibold text-slate-800 mt-4">1. Hasil Layanan</h2>
        <p>
          Hasil konversi, kompresi, atau pemrosesan file di DukiTools bergantung pada kualitas dan format file asli yang Anda unggah. Kami tidak menjamin bahwa hasil yang diperoleh akan sempurna atau sesuai dengan ekspektasi Anda untuk semua jenis file, terutama file dengan format yang jarang atau rusak.
        </p>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">2. Ketersediaan Layanan</h2>
        <p>
          Kami berusaha menjaga ketersediaan layanan 24/7, namun DukiTools tidak bertanggung jawab atas kerugian yang timbul akibat downtime, pemeliharaan, atau gangguan teknis lainnya.
        </p>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">3. Data dan Backup</h2>
        <p>
          File yang diproses di DukiTools bersifat sementara dan akan dihapus otomatis. Kami sangat menyarankan Anda untuk selalu menyimpan backup file asli sebelum menggunakan layanan kami. DukiTools tidak bertanggung jawab atas kehilangan data.
        </p>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">4. Tautan Eksternal</h2>
        <p>
          Situs kami mungkin berisi tautan ke situs pihak ketiga. Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik situs tersebut.
        </p>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">5. Perubahan Disclaimer</h2>
        <p>
          Disclaimer ini dapat berubah sewaktu-waktu. Perubahan akan diumumkan melalui halaman ini. Dengan terus menggunakan DukiTools setelah perubahan, Anda dianggap menyetujui perubahan tersebut.
        </p>
      </div>
    </div>
  );
}
