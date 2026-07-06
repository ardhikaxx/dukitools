import { Metadata } from 'next';
import { ToolConfig } from '@/types/tool';

export function generateToolMetadata(tool: ToolConfig): Metadata {
  const url = `https://dukitools.com/${tool.category}/${tool.slug}`;
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
    },
    twitter: { card: 'summary_large_image', title: tool.name, description: tool.shortDescription },
    keywords: tool.keywords,
  };
}
