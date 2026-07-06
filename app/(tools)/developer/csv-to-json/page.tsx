import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CsvToJsonWorkspace from './CsvToJsonWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('csv-to-json');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CsvToJsonPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CsvToJsonWorkspace tool={tool} />
    </ToolLayout>
  );
}
