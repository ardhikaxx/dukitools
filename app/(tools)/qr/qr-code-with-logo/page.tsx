import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import QrCodeWithLogoWorkspace from './QrCodeWithLogoWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('qr-code-with-logo');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function QrCodeWithLogoPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <QrCodeWithLogoWorkspace tool={tool} />
    </ToolLayout>
  );
}
