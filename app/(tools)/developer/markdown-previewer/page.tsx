import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import MarkdownPreviewerWorkspace from './MarkdownPreviewerWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('markdown-previewer');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function MarkdownPreviewerPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <MarkdownPreviewerWorkspace tool={tool} />
    </ToolLayout>
  );
}
