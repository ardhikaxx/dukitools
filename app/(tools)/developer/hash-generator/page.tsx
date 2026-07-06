import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import HashGeneratorWorkspace from './HashGeneratorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('hash-generator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function HashGeneratorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <HashGeneratorWorkspace tool={tool} />
    </ToolLayout>
  );
}
