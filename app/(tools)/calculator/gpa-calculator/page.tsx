import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import GpaCalculatorWorkspace from './GpaCalculatorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('gpa-calculator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function GpaCalculatorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <GpaCalculatorWorkspace tool={tool} />
    </ToolLayout>
  );
}
