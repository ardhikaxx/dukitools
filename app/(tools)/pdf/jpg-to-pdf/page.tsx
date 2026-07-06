import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import JpgToPdfWorkspace from './JpgToPdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('jpg-to-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function JpgToPdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <JpgToPdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
