import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PdfToTextWorkspace from './PdfToTextWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('pdf-to-text');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PdfToTextPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PdfToTextWorkspace tool={tool} />
    </ToolLayout>
  );
}
