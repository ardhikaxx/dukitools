import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PowerpointToPdfWorkspace from './PowerpointToPdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('powerpoint-to-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PowerpointToPdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PowerpointToPdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
