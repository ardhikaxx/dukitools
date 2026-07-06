import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `https://dukitools.com${item.href}` : undefined,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-slate-500">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:text-indigo-600 transition-colors">{item.label}</Link>
            ) : (
              <span className="text-slate-800 font-medium">{item.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight size={14} />}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
