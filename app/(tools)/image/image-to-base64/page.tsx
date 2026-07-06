import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import ImageToBase64Workspace from './ImageToBase64Workspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('image-to-base64');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function ImageToBase64Page() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <ImageToBase64Workspace tool={tool} />
    </ToolLayout>
  );
}
