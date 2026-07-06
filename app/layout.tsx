import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastProvider from '@/components/toast/ToastProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dukitools.com'),
  title: {
    default: 'DukiTools — All Your Online Tools in One Place',
    template: '%s | DukiTools',
  },
  description:
    'Kumpulan online tools gratis: PDF, Image, Developer, Office, Calculator, Color, QR, dan Security Tools. Tanpa login, langsung pakai.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white text-slate-900 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
