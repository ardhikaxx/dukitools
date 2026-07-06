import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import DateDifferenceCalculatorWorkspace from './DateDifferenceCalculatorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('date-difference-calculator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function DateDifferenceCalculatorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <DateDifferenceCalculatorWorkspace tool={tool} />
    </ToolLayout>
  );
}
