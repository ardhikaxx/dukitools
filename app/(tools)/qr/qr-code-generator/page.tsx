import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import QrCodeGeneratorWorkspace from './QrCodeGeneratorWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('qr-code-generator');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function QrCodeGeneratorPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <QrCodeGeneratorWorkspace tool={tool} />
    </ToolLayout>
  );
}
