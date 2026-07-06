import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PdfToWordWorkspace from './PdfToWordWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('pdf-to-word');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PdfToWordPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PdfToWordWorkspace tool={tool} />
    </ToolLayout>
  );
}
