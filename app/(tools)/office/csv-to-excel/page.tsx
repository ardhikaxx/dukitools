import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CsvToExcelWorkspace from './CsvToExcelWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('csv-to-excel');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CsvToExcelPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CsvToExcelWorkspace tool={tool} />
    </ToolLayout>
  );
}
