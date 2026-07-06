import { MetadataRoute } from 'next';
import { toolsRegistry } from '@/lib/registry/tools-registry';
import { categoriesRegistry } from '@/lib/registry/categories-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dukitools.com';
  const toolUrls = toolsRegistry.map((t) => ({
    url: `${base}/${t.category}/${t.slug}`,
    changeFrequency: 'monthly' as const,
    priority: t.isPopular ? 0.9 : 0.6,
  }));
  const categoryUrls = categoriesRegistry.map((c) => ({
    url: `${base}/${c.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  const staticPages = [
    { url: `${base}/about`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${base}/privacy-policy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${base}/terms-of-service`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${base}/disclaimer`, changeFrequency: 'yearly' as const, priority: 0.3 },
  ];
  return [
    { url: base, priority: 1.0, changeFrequency: 'daily' },
    ...staticPages,
    ...categoryUrls,
    ...toolUrls,
  ];
}
