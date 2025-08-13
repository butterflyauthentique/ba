'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ShareButton from '@/components/ShareButton';
import { ClientPostService } from '@/lib/services/postService';

type Props = { slug: string };

export default function BlogPostClient({ slug }: Props) {
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const p = await ClientPostService.getBySlug(slug);
        if (!p) {
          setError('Post not found');
          return;
        }
        if (p.status !== 'published') {
          // allow scheduled if time passed
          const now = new Date();
          const scheduledAt = p.scheduledAt?.toDate?.();
          if (!(p.status === 'scheduled' && scheduledAt && scheduledAt <= now)) {
            setError('Post not available');
            return;
          }
        }
        setPost(p);
      } catch (e) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-16">
        <div className="h-6 w-40 bg-gray-200 animate-pulse mb-4" />
        <div className="h-8 w-3/4 bg-gray-200 animate-pulse mb-2" />
        <div className="h-8 w-2/3 bg-gray-200 animate-pulse mb-6" />
        <div className="aspect-[9/16] bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-16">
        <p className="text-gray-600">{error || 'Post not found.'}</p>
        <Link href="/blog" className="text-red-600 font-medium">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      <header className="bg-gray-50 border-b">
        <div className="container py-10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{new Date(post.publishedAt?.toDate?.() || Date.now()).toLocaleDateString('en-IN')}</p>
            <ShareButton url={`/blog/${post.slug}`} title={post.title} text={post.excerpt} />
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">{post.title}</h1>
          <p className="mt-2 text-gray-600 max-w-3xl">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-red-100">
              <Image src={post.authorPhotoUrl || '/logo.png'} alt={post.authorName || 'Author'} fill className="object-cover bg-white" />
            </div>
            <div className="text-sm text-gray-700">
              <div className="font-medium">{post.authorName || 'Butterfly Authentique Editorial'}</div>
              <div className="text-gray-500">Butterfly Authentique</div>
            </div>
          </div>
        </div>
      </header>
      <div className="container py-10">
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        <div className="mt-10 pt-6 border-t flex items-center justify-between">
          <Link href="/shop?category=all" className="text-red-600 font-medium">Shop the Collection</Link>
          <Link href="/blog" className="text-gray-600 hover:text-gray-900">All posts</Link>
        </div>
      </div>
    </article>
  );
}


