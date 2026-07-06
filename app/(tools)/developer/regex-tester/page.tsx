import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import RegexTesterWorkspace from './RegexTesterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('regex-tester');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function RegexTesterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <RegexTesterWorkspace tool={tool} />
    </ToolLayout>
  );
}
