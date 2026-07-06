import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import SqlFormatterWorkspace from './SqlFormatterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('sql-formatter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function SqlFormatterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <SqlFormatterWorkspace tool={tool} />
    </ToolLayout>
  );
}
