import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CompressImageWorkspace from './CompressImageWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('compress-image');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CompressImagePage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CompressImageWorkspace tool={tool} />
    </ToolLayout>
  );
}
