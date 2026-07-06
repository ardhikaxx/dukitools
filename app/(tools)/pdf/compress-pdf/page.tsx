import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CompressPdfWorkspace from './CompressPdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('compress-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CompressPdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CompressPdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
