import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import WhitespaceRemoverWorkspace from './WhitespaceRemoverWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('whitespace-remover');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function WhitespaceRemoverPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <WhitespaceRemoverWorkspace tool={tool} />
    </ToolLayout>
  );
}
