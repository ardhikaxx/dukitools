import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CurrencyConverterWorkspace from './CurrencyConverterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('currency-converter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CurrencyConverterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CurrencyConverterWorkspace tool={tool} />
    </ToolLayout>
  );
}
