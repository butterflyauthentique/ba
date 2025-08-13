"use client";

import Link from 'next/link';
import Image from 'next/image';
import ShareMenu from '@/components/ShareMenu';
import { ClientPostService, fetchPublishedPostsViaREST } from '@/lib/services/postService';
import { useEffect, useState } from 'react';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let published = await ClientPostService.getPublishedPosts(50);
        if (!published || (Array.isArray(published) && published.length === 0)) {
          // Fallback if client SDK blocked in incognito/non-auth
          published = (await fetchPublishedPostsViaREST(50)) as any;
        }
        setPosts(published as any);
      } catch (e: any) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = Array.from(
    new Set(
      ['All', ...posts
        .map((p: any) => p.category)
        .filter((c: any) => typeof c === 'string' && c.trim().length > 0)]
    )
  );

  const filtered = posts.filter((p: any) => {
    const inCategory = selectedCategory === 'All' || (p.category || '') === selectedCategory;
    const q = search.trim().toLowerCase();
    if (!q) return inCategory;
    const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(' ')} ${(p.authorName || '')}`.toLowerCase();
    return inCategory && hay.includes(q);
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container py-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Journal</h1>
          <p className="text-white/90 mt-2 text-sm sm:text-base">Stories on handcrafted style, art, and slow fashion.</p>
        </div>
      </header>
      {/* Sticky filters/search */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="container py-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors ${selectedCategory === c ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Search posts, tags, authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>
      <main className="container py-6 sm:py-8">
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-200 animate-pulse aspect-[3/4]" />
                <div className="p-4">
                  <div className="h-3 bg-gray-200 w-20 mb-2 animate-pulse" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p: any) => (
              <article key={p.id || p.slug} className="group rounded-xl border border-gray-200 overflow-hidden bg-white transition-all hover:shadow-lg focus-within:shadow-lg">
                <div className="relative">
                  <div className="p-2 flex items-center justify-between">
                    <div className="text-[10px] sm:text-xs text-gray-500">{new Date(p.publishedAt?.toDate?.() || p.updatedAt?.toDate?.() || Date.now()).toLocaleDateString('en-IN')}</div>
                    <ShareMenu url={`/blog/${p.slug}?id=${p.id || ''}`} title={p.title} description={p.excerpt} />
                  </div>
                </div>
                <Link href={`/blog/${p.slug}?id=${p.id || ''}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <Image src={p.coverImage} alt={p.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                    {p.category ? (
                      <span className="absolute left-2 top-2 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/90 border border-gray-200 text-gray-700 shadow-sm">{p.category}</span>
                    ) : null}
                  </div>
                  <div className="p-3">
                    <h2 className="mt-1 font-semibold text-sm sm:text-base text-gray-900 group-hover:text-red-600 line-clamp-2 min-h-[2.5rem]">{p.title}</h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">{p.excerpt}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-1 ring-gray-200">
                        <Image src={p.authorPhotoUrl || '/logo.png'} alt={p.authorName || 'Author'} fill className="object-cover" />
                      </div>
                      <div className="text-[11px] sm:text-xs text-gray-700">{p.authorName || 'Butterfly Authentique Editorial'}</div>
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


