import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import BarcodeGeneratorWorkspace from './BarcodeGeneratorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('barcode-generator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function BarcodeGeneratorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <BarcodeGeneratorWorkspace tool={tool} />
    </ToolLayout>
  );
}
