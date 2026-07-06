import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import ExcelToCsvWorkspace from './ExcelToCsvWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('excel-to-csv');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function ExcelToCsvPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <ExcelToCsvWorkspace tool={tool} />
    </ToolLayout>
  );
}
