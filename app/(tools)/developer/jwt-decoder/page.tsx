import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import JwtDecoderWorkspace from './JwtDecoderWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('jwt-decoder');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function JwtDecoderPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <JwtDecoderWorkspace tool={tool} />
    </ToolLayout>
  );
}
