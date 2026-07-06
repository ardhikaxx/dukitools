import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PercentageCalculatorWorkspace from './PercentageCalculatorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('percentage-calculator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PercentageCalculatorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PercentageCalculatorWorkspace tool={tool} />
    </ToolLayout>
  );
}
