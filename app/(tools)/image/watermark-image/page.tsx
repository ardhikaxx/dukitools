import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import WatermarkImageWorkspace from './WatermarkImageWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('watermark-image');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function WatermarkImagePage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <WatermarkImageWorkspace tool={tool} />
    </ToolLayout>
  );
}
