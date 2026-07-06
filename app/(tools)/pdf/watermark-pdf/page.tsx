import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import WatermarkPdfWorkspace from './WatermarkPdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('watermark-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function WatermarkPdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <WatermarkPdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
