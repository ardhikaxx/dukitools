import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CronExpressionGeneratorWorkspace from './CronExpressionGeneratorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('cron-expression-generator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CronExpressionGeneratorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CronExpressionGeneratorWorkspace tool={tool} />
    </ToolLayout>
  );
}
