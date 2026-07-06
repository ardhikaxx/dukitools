import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ContactForm from './ContactForm';

const BASE_URL = 'https://dukitools.com';

export const metadata: Metadata = {
  title: 'Kontak DukiTools',
  description: 'Hubungi tim DukiTools untuk pertanyaan, saran, atau laporan masalah.',
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: 'Kontak DukiTools',
    description: 'Hubungi tim DukiTools untuk pertanyaan, saran, atau laporan masalah.',
    url: `${BASE_URL}/contact`,
    siteName: 'DukiTools',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontak DukiTools',
    description: 'Hubungi tim DukiTools untuk pertanyaan, saran, atau laporan masalah.',
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dukitools.com/' },
              { '@type': 'ListItem', position: 2, name: 'Kontak' },
            ],
          }),
        }}
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Kontak' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Hubungi Kami</h1>
      <p className="mt-2 text-slate-500">Punya pertanyaan, saran, atau menemukan bug? Silakan kirim pesan melalui form di bawah.</p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
