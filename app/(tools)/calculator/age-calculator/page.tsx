import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import AgeCalculatorWorkspace from './AgeCalculatorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('age-calculator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function AgeCalculatorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <AgeCalculatorWorkspace tool={tool} />
    </ToolLayout>
  );
}
