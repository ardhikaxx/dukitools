import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import JsonFormatterWorkspace from './JsonFormatterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('json-formatter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function JsonFormatterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <JsonFormatterWorkspace tool={tool} />
    </ToolLayout>
  );
}
