import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import ExcelToPdfWorkspace from './ExcelToPdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('excel-to-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function ExcelToPdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <ExcelToPdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
