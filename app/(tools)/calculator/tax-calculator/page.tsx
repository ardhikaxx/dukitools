import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import TaxCalculatorWorkspace from './TaxCalculatorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('tax-calculator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function TaxCalculatorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <TaxCalculatorWorkspace tool={tool} />
    </ToolLayout>
  );
}
