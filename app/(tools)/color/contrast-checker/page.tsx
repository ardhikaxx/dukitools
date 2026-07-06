import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import ContrastCheckerWorkspace from './ContrastCheckerWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('contrast-checker');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function ContrastCheckerPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <ContrastCheckerWorkspace tool={tool} />
    </ToolLayout>
  );
}
