import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import HexToRgbWorkspace from './HexToRgbWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('hex-to-rgb');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function HexToRgbPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <HexToRgbWorkspace tool={tool} />
    </ToolLayout>
  );
}
