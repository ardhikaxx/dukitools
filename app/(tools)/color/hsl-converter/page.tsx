import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import HslConverterWorkspace from './HslConverterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('hsl-converter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function HslConverterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <HslConverterWorkspace tool={tool} />
    </ToolLayout>
  );
}
