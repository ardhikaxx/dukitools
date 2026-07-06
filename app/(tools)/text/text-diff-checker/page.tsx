import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import TextDiffCheckerWorkspace from './TextDiffCheckerWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('text-diff-checker');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function TextDiffCheckerPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <TextDiffCheckerWorkspace tool={tool} />
    </ToolLayout>
  );
}
