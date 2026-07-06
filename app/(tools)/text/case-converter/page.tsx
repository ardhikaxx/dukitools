import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CaseConverterWorkspace from './CaseConverterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('case-converter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CaseConverterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CaseConverterWorkspace tool={tool} />
    </ToolLayout>
  );
}
