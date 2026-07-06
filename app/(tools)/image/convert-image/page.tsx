import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import ConvertImageWorkspace from './ConvertImageWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('convert-image');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function ConvertImagePage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <ConvertImageWorkspace tool={tool} />
    </ToolLayout>
  );
}
