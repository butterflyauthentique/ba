'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientPostService, Post } from '@/lib/services/postService';
import { BLOG_POSTS } from '@/content/blog/posts';
import { Plus, Edit3, Calendar, Eye } from 'lucide-react';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ClientPostService.listAll().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const importSeed = async () => {
    const seed = BLOG_POSTS[0];
    if (!seed) return;
    const exists = posts.some((p) => p.slug === seed.slug);
    if (exists) return;
    const id = await ClientPostService.createPost({
      title: seed.title,
      slug: seed.slug,
      excerpt: seed.excerpt,
      coverImage: seed.coverImage,
      contentHtml: seed.body,
      tags: seed.tags,
      authorName: 'Butterfly Authentique Editorial',
      authorPhotoUrl: '/logo.png',
      status: 'published',
      scheduledAt: null,
    } as any);
    const list = await ClientPostService.listAll();
    setPosts(list);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <div className="flex items-center gap-3">
          <button onClick={importSeed} className="inline-flex items-center gap-2 border px-3 py-2 rounded-lg">Import seed</button>
          <Link href="/admin/posts/new" className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3">{p.updatedAt?.toDate?.().toLocaleString?.() || ''}</td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Link href={`/admin/posts/edit/${p.id}`} className="text-red-600 inline-flex items-center gap-1"><Edit3 className="w-4 h-4" /> Edit</Link>
                    <Link href={`/blog/${p.slug}`} className="text-gray-700 inline-flex items-center gap-1"><Eye className="w-4 h-4" /> View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


