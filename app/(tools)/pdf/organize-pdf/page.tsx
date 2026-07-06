import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import OrganizePdfWorkspace from './OrganizePdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('organize-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function OrganizePdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <OrganizePdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
