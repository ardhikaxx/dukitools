export type ProcessingType = 'client' | 'server';

export type CategorySlug =
  | 'pdf' | 'image' | 'text' | 'developer'
  | 'office' | 'calculator' | 'color' | 'qr' | 'security';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolConfig {
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  benefits: string[];
  howItWorks: string[];
  icon: string;
  processingType: ProcessingType;
  acceptedFileTypes?: string[];
  acceptedMimeTypes?: string[];
  maxFileSizeMB?: number;
  maxFiles?: number;
  isPopular?: boolean;
  isNew?: boolean;
  faq: FaqItem[];
  keywords: string[];
  relatedToolSlugs?: string[];
}
