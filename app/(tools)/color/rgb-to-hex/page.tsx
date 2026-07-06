import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import RgbToHexWorkspace from './RgbToHexWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('rgb-to-hex');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function RgbToHexPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <RgbToHexWorkspace tool={tool} />
    </ToolLayout>
  );
}
