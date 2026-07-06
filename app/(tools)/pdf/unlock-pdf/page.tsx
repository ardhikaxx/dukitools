import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import UnlockPdfWorkspace from './UnlockPdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('unlock-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function UnlockPdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <UnlockPdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
