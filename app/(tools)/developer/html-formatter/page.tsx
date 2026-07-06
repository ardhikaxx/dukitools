import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import HtmlFormatterWorkspace from './HtmlFormatterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('html-formatter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function HtmlFormatterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <HtmlFormatterWorkspace tool={tool} />
    </ToolLayout>
  );
}
