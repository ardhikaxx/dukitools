import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import PasswordStrengthCheckerWorkspace from './PasswordStrengthCheckerWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('password-strength-checker');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function PasswordStrengthCheckerPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <PasswordStrengthCheckerWorkspace tool={tool} />
    </ToolLayout>
  );
}
