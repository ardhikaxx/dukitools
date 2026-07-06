import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import BmiCalculatorWorkspace from './BmiCalculatorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('bmi-calculator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function BmiCalculatorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <BmiCalculatorWorkspace tool={tool} />
    </ToolLayout>
  );
}
