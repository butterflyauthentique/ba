'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ShareMenu from '@/components/ShareMenu';
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
      <div className="container py-10">
        {/* Title + Meta */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">{new Date(post.publishedAt?.toDate?.() || Date.now()).toLocaleDateString('en-IN')}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>
            {(post.category || post.tags?.length) && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                {post.category && <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">{post.category}</span>}
                {post.tags?.slice(0,3).map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">#{t}</span>
                ))}
                {post.readingTime ? <span className="ml-2">• {post.readingTime} min read</span> : null}
              </div>
            )}
            <p className="mt-3 text-gray-600 max-w-3xl">{post.excerpt}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-red-100">
                <Image src={post.authorPhotoUrl || '/logo.png'} alt={post.authorName || 'Author'} fill className="object-cover bg-white" />
              </div>
              <div className="text-sm text-gray-700">
                <div className="font-medium">{post.authorName || 'Butterfly Authentique Editorial'}</div>
                <div className="text-gray-500">Butterfly Authentique</div>
              </div>
            </div>
          </div>
          <ShareMenu url={`/blog/${post.slug}`} title={post.title} description={post.excerpt} />
        </div>

        {/* Content Layout: Small inline cover with wrapped text (classic blog feel) */}
        <div className="mt-8">
          <div className="prose prose-lg max-w-none">
            <figure className="float-left mr-6 mb-4 w-44 sm:w-56 lg:w-72">
              <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden border bg-white">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-contain bg-white"
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 30vw, 20vw"
                />
              </div>
              <figcaption className="mt-2 text-xs text-gray-500">{post.title}</figcaption>
            </figure>
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </div>
          <div className="clear-both" />
          <div className="mt-10 pt-6 border-t flex items-center justify-between">
            <Link href="/shop?category=all" className="text-red-600 font-medium">Shop the Collection</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">All posts</Link>
          </div>
        </div>
      </div>
    </article>
  );
}


