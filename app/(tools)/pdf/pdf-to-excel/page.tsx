import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PdfToExcelWorkspace from './PdfToExcelWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('pdf-to-excel');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PdfToExcelPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PdfToExcelWorkspace tool={tool} />
    </ToolLayout>
  );
}
