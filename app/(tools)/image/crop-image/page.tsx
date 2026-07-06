import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CropImageWorkspace from './CropImageWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('crop-image');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CropImagePage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CropImageWorkspace tool={tool} />
    </ToolLayout>
  );
}
