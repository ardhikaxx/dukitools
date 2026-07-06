import { toolsRegistry } from './tools-registry';
import { categoriesRegistry } from './categories-registry';
import { ToolConfig, CategorySlug } from '@/types/tool';

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return toolsRegistry.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: CategorySlug): ToolConfig[] {
  return toolsRegistry.filter((t) => t.category === category);
}

export function getPopularTools(limit = 8): ToolConfig[] {
  return toolsRegistry.filter((t) => t.isPopular).slice(0, limit);
}

export function getNewTools(limit = 8): ToolConfig[] {
  return toolsRegistry.filter((t) => t.isNew).slice(0, limit);
}

export function getCategoryBySlug(slug: CategorySlug) {
  return categoriesRegistry.find((c) => c.slug === slug);
}

export function getRelatedTools(tool: ToolConfig, limit = 4): ToolConfig[] {
  if (tool.relatedToolSlugs?.length) {
    return tool.relatedToolSlugs
      .map((s) => getToolBySlug(s))
      .filter((t): t is ToolConfig => Boolean(t));
  }
  return toolsRegistry
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, limit);
}

export function searchTools(query: string, limit = 8): ToolConfig[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return toolsRegistry
    .filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q)) ||
        t.shortDescription.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

export function getToolCountByCategory(category: CategorySlug): number {
  return toolsRegistry.filter((t) => t.category === category).length;
}

export function getTotalTools(): number {
  return toolsRegistry.length;
}
