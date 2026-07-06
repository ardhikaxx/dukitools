import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import RotateImageWorkspace from './RotateImageWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('rotate-image');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function RotateImagePage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <RotateImageWorkspace tool={tool} />
    </ToolLayout>
  );
}
