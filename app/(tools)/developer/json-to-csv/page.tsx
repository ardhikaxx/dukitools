import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import JsonToCsvWorkspace from './JsonToCsvWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('json-to-csv');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function JsonToCsvPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <JsonToCsvWorkspace tool={tool} />
    </ToolLayout>
  );
}
