import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import WordCounterWorkspace from './WordCounterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('word-counter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function WordCounterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <WordCounterWorkspace tool={tool} />
    </ToolLayout>
  );
}
