import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PdfToPptWorkspace from './PdfToPptWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('pdf-to-ppt');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PdfToPptPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PdfToPptWorkspace tool={tool} />
    </ToolLayout>
  );
}
