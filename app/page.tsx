import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import PopularTools from '@/components/home/PopularTools';
import NewTools from '@/components/home/NewTools';
import ValueProposition from '@/components/home/ValueProposition';
import { getPopularTools, getNewTools } from '@/lib/registry/registry-helpers';
import { categoriesRegistry } from '@/lib/registry/categories-registry';

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
