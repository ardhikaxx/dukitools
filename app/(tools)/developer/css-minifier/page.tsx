import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CssMinifierWorkspace from './CssMinifierWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('css-minifier');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CssMinifierPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CssMinifierWorkspace tool={tool} />
    </ToolLayout>
  );
}
