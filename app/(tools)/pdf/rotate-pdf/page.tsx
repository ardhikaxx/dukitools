import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import RotatePdfWorkspace from './RotatePdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('rotate-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function RotatePdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <RotatePdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
