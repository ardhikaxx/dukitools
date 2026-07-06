import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PasswordGeneratorWorkspace from './PasswordGeneratorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('password-generator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PasswordGeneratorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PasswordGeneratorWorkspace tool={tool} />
    </ToolLayout>
  );
}
