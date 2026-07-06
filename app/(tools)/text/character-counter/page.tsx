import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CharacterCounterWorkspace from './CharacterCounterWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('character-counter');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600;

export default function CharacterCounterPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <CharacterCounterWorkspace tool={tool} />
    </ToolLayout>
  );
}
