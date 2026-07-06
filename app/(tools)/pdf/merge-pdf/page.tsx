import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import MergePdfWorkspace from './MergePdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('merge-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function MergePdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <MergePdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
