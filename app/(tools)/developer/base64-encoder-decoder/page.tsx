import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import Base64EncoderDecoderWorkspace from './Base64EncoderDecoderWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('base64-encoder-decoder');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function Base64EncoderDecoderPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <Base64EncoderDecoderWorkspace tool={tool} />
    </ToolLayout>
  );
}
