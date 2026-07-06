import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import DiscountCalculatorWorkspace from './DiscountCalculatorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('discount-calculator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function DiscountCalculatorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <DiscountCalculatorWorkspace tool={tool} />
    </ToolLayout>
  );
}
