import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import UuidGeneratorWorkspace from './UuidGeneratorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('uuid-generator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function UuidGeneratorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <UuidGeneratorWorkspace tool={tool} />
    </ToolLayout>
  );
}
