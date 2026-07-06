import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import LoremIpsumGeneratorWorkspace from './LoremIpsumGeneratorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('lorem-ipsum-generator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function LoremIpsumGeneratorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <LoremIpsumGeneratorWorkspace tool={tool} />
    </ToolLayout>
  );
}
