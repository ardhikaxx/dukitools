import { Metadata } from 'next';
import { ToolConfig } from '@/types/tool';

const BASE_URL = 'https://dukitools.com';

export function generateToolMetadata(tool: ToolConfig): Metadata {
  const url = `${BASE_URL}/${tool.category}/${tool.slug}`;
  return {
    title: `${tool.name} — Gratis & Tanpa Login`,
    description: tool.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      title: tool.name,
      description: tool.shortDescription,
      url,
      siteName: 'DukiTools',
      type: 'website',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.name,
      description: tool.shortDescription,
    },
    keywords: tool.keywords,
    robots: { index: true, follow: true },
  };
}

export function generateCategoryMetadata(name: string, description: string, slug: string): Metadata {
  const url = `${BASE_URL}/${slug}`;
  return {
    title: `${name} — Gratis & Tanpa Login`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: name,
      description,
      url,
      siteName: 'DukiTools',
      type: 'website',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
    },
    robots: { index: true, follow: true },
  };
}
