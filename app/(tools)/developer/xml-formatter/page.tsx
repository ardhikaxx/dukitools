import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import XmlFormatterWorkspace from './XmlFormatterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('xml-formatter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function XmlFormatterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <XmlFormatterWorkspace tool={tool} />
    </ToolLayout>
  );
}
