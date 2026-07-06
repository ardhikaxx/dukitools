import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import FileHashCheckerWorkspace from './FileHashCheckerWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('file-hash-checker');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function FileHashCheckerPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <FileHashCheckerWorkspace tool={tool} />
    </ToolLayout>
  );
}
