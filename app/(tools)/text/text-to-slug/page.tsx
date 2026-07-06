import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import TextToSlugWorkspace from './TextToSlugWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('text-to-slug');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function TextToSlugPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <TextToSlugWorkspace tool={tool} />
    </ToolLayout>
  );
}
