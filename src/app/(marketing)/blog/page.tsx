"use client";

import Link from 'next/link';
import Image from 'next/image';
import ShareButton from '@/components/ShareButton';
import { ClientPostService } from '@/lib/services/postService';
import { useEffect, useState } from 'react';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const all = await ClientPostService.listAll(50);
        const now = new Date();
        const published = all.filter((p: any) => p.status === 'published' || (p.status === 'scheduled' && p.scheduledAt?.toDate?.() && p.scheduledAt.toDate() <= now));
        setPosts(published);
      } catch (e: any) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container py-10">
          <h1 className="text-3xl sm:text-4xl font-bold">Journal</h1>
          <p className="text-white/90 mt-2">Stories on handcrafted style, art, and slow fashion.</p>
        </div>
      </header>
      <main className="container py-10">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-200 animate-pulse aspect-[16/9]" />
                <div className="p-4">
                  <div className="h-3 bg-gray-200 w-24 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && error && (
          <p className="text-gray-600">{error}</p>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((p: any) => (
              <article key={p.slug} className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow max-w-md bg-white">
                <div className="p-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">{new Date(p.publishedAt?.toDate?.() || p.updatedAt?.toDate?.() || Date.now()).toLocaleDateString('en-IN')}</div>
                  <ShareButton url={`/blog/${p.slug}`} title={p.title} text={p.excerpt} />
                </div>
                <Link href={`/blog/${p.slug}`} className="block">
                  <div className="relative aspect-[9/16] bg-gray-100">
                    <Image src={p.coverImage} alt={p.title} fill className="object-contain" />
                  </div>
                  <div className="p-4">
                    <h2 className="mt-1 font-semibold text-gray-900 group-hover:text-red-600">{p.title}</h2>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.excerpt}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-200">
                        <Image src={p.authorPhotoUrl || '/logo.png'} alt={p.authorName || 'Author'} fill className="object-cover" />
                      </div>
                      <div className="text-xs text-gray-700">{p.authorName || 'Butterfly Authentique Editorial'}</div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


