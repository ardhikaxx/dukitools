import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import RemoveDuplicateLinesWorkspace from './RemoveDuplicateLinesWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('remove-duplicate-lines');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function RemoveDuplicateLinesPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <RemoveDuplicateLinesWorkspace tool={tool} />
    </ToolLayout>
  );
}
