import { Metadata } from 'next';
import Link from 'next/link';
import BlogPostClient from './BlogPostClient';
import { fetchPostBySlugViaREST } from '@/lib/services/postService';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await fetchPostBySlugViaREST(slug);
    if (!post) {
      return {
        title: 'Journal | Butterfly Authentique',
      };
    }
    const title = `${post.title} | Butterfly Authentique`;
    const description = (post.excerpt || '').slice(0, 170);
    const ogImage = post.coverImage ? [{ url: post.coverImage }] : undefined;
    const url = `https://butterflyauthentique.in/blog/${slug}`;
    return {
      title,
      description,
      alternates: { canonical: url },
      metadataBase: new URL('https://butterflyauthentique.in'),
      openGraph: {
        type: 'article',
        siteName: 'Butterfly Authentique',
        title: post.title,
        description,
        url,
        images: ogImage,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
    };
  } catch {
    return { title: 'Journal | Butterfly Authentique' };
  }
}

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  if (!slug) {
    return (
      <div className="container py-16">
        <p className="text-gray-600">Post not found.</p>
        <Link href="/blog" className="text-red-600 font-medium">Back to Blog</Link>
      </div>
    );
  }
  return <BlogPostClient slug={slug} />;
}


