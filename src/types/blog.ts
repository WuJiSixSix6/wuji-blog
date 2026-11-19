export type ThemeMode = 'dark' | 'light';

export interface PostFrontmatter {
  title: string;
  subtitle?: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  featured?: boolean;
  accent?: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  html: string;
  toc: TocItem[];
  readingMinutes: number;
  wordCount: number;
}
