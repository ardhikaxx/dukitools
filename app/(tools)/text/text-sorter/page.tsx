import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import TextSorterWorkspace from './TextSorterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('text-sorter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function TextSorterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <TextSorterWorkspace tool={tool} />
    </ToolLayout>
  );
}
