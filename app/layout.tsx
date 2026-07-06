import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastProvider from '@/components/toast/ToastProvider';
import { organizationSchema, websiteSchema } from '@/lib/seo/json-ld';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = 'https://dukitools.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DukiTools — All Your Online Tools in One Place',
    template: '%s | DukiTools',
  },
  description:
    'Kumpulan online tools gratis: PDF, Image, Developer, Office, Calculator, Color, QR, dan Security Tools. Tanpa login, langsung pakai.',
  openGraph: {
    type: 'website',
    siteName: 'DukiTools',
    title: 'DukiTools — All Your Online Tools in One Place',
    description: 'Kumpulan online tools gratis: PDF, Image, Developer, Office, Calculator, Color, QR, dan Security Tools. Tanpa login, langsung pakai.',
    url: siteUrl,
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DukiTools — All Your Online Tools in One Place',
    description: 'Kumpulan online tools gratis: PDF, Image, Developer, Office, Calculator, Color, QR, dan Security Tools. Tanpa login, langsung pakai.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      websiteSchema(),
    ],
  };

  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
