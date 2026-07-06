import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import TextEncryptorWorkspace from './TextEncryptorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('text-encryptor');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function TextEncryptorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <TextEncryptorWorkspace tool={tool} />
    </ToolLayout>
  );
}
