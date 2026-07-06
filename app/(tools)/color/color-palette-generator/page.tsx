import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import ColorPaletteGeneratorWorkspace from './ColorPaletteGeneratorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('color-palette-generator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function ColorPaletteGeneratorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <ColorPaletteGeneratorWorkspace tool={tool} />
    </ToolLayout>
  );
}
