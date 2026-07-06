import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import QrCodeScannerWorkspace from './QrCodeScannerWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('qr-code-scanner');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function QrCodeScannerPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <QrCodeScannerWorkspace tool={tool} />
    </ToolLayout>
  );
}
