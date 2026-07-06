import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import WordToPdfWorkspace from './WordToPdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('word-to-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function WordToPdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <WordToPdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
