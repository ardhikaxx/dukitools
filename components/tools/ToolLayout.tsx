import { ToolConfig } from '@/types/tool';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ToolHeader from './ToolHeader';
import ToolFAQ from './ToolFAQ';
import RelatedTools from './RelatedTools';
import { getCategoryBySlug, getRelatedTools } from '@/lib/registry/registry-helpers';

export default function ToolLayout({ tool, children }: { tool: ToolConfig; children: React.ReactNode }) {
  const category = getCategoryBySlug(tool.category);
  const related = getRelatedTools(tool);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
        description: tool.shortDescription,
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category?.name ?? tool.category, href: `/${tool.category}` },
          { label: tool.name },
        ]}
      />

      <ToolHeader tool={tool} />

      <div className="mt-8 rounded-2xl border border-slate-100 p-6 shadow-sm bg-white">
        {children}
      </div>

      {tool.howItWorks.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Cara Kerja {tool.name}</h2>
          <ol className="list-decimal space-y-3 pl-5 text-slate-600">
            {tool.howItWorks.map((step, i) => <li key={i} className="leading-relaxed">{step}</li>)}
          </ol>
        </section>
      )}

      {tool.faq.length > 0 && <ToolFAQ faq={tool.faq} />}

      {related.length > 0 && <RelatedTools tools={related} />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
