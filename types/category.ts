import { CategorySlug } from './tool';

export interface CategoryConfig {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  accentHex: string;
}
