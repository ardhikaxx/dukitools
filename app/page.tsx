import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import PopularTools from '@/components/home/PopularTools';
import NewTools from '@/components/home/NewTools';
import ValueProposition from '@/components/home/ValueProposition';
import { getPopularTools, getNewTools, getTotalTools } from '@/lib/registry/registry-helpers';
import { categoriesRegistry } from '@/lib/registry/categories-registry';

export const metadata: Metadata = {
  title: 'DukiTools — All Your Online Tools in One Place',
  description: 'Kumpulan 49+ online tools gratis: PDF, Image, Developer, Office, Calculator, Color, QR, dan Security Tools. Tanpa login, langsung pakai.',
  openGraph: {
    title: 'DukiTools — All Your Online Tools in One Place',
    description: 'Kumpulan 49+ online tools gratis tanpa login. PDF, Image, Developer, Office, Calculator, Color, QR, dan Security Tools.',
  },
  twitter: {
    title: 'DukiTools — All Your Online Tools in One Place',
    description: 'Kumpulan 49+ online tools gratis tanpa login. PDF, Image, Developer, Office, Calculator, Color, QR, dan Security Tools.',
  },
};

export default function HomePage() {
  const popularTools = getPopularTools(8);
  const newTools = getNewTools(6);

  return (
    <>
      <HeroSection />
      <CategoryCards categories={categoriesRegistry} />
      <PopularTools tools={popularTools} />
      {newTools.length > 0 && <NewTools tools={newTools} />}
      <ValueProposition />
    </>
  );
}
