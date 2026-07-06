import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import TextReverserWorkspace from './TextReverserWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('text-reverser');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function TextReverserPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <TextReverserWorkspace tool={tool} />
    </ToolLayout>
  );
}
