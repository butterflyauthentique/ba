import { Metadata } from 'next';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  coverImage: string;
  tags: string[];
  readingTimeMinutes: number;
  og?: Partial<Metadata['openGraph']>;
  body: string; // HTML string (render with dangerouslySetInnerHTML in a trusted path)
};

// NOTE: Keep content brand-safe and SEO friendly
export const BLOG_POSTS: BlogPost[] = [];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}


