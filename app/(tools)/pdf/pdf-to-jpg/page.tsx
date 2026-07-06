import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PdfToJpgWorkspace from './PdfToJpgWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('pdf-to-jpg');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PdfToJpgPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PdfToJpgWorkspace tool={tool} />
    </ToolLayout>
  );
}
