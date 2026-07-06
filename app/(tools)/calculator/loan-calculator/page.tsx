import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import LoanCalculatorWorkspace from './LoanCalculatorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('loan-calculator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function LoanCalculatorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <LoanCalculatorWorkspace tool={tool} />
    </ToolLayout>
  );
}
