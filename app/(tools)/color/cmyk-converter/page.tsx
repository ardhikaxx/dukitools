import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CmykConverterWorkspace from './CmykConverterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('cmyk-converter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CmykConverterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CmykConverterWorkspace tool={tool} />
    </ToolLayout>
  );
}
