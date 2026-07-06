import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import ResizeImageWorkspace from './ResizeImageWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('resize-image');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function ResizeImagePage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <ResizeImageWorkspace tool={tool} />
    </ToolLayout>
  );
}
