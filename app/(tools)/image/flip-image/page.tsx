import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import FlipImageWorkspace from './FlipImageWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('flip-image');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function FlipImagePage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <FlipImageWorkspace tool={tool} />
    </ToolLayout>
  );
}
