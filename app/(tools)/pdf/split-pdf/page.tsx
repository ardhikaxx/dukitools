import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import SplitPdfWorkspace from './SplitPdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('split-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function SplitPdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <SplitPdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
