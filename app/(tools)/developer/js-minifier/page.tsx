import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import JsMinifierWorkspace from './JsMinifierWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('js-minifier');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function JsMinifierPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <JsMinifierWorkspace tool={tool} />
    </ToolLayout>
  );
}
