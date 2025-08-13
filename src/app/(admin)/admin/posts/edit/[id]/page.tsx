'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClientPostService, Post } from '@/lib/services/postService';
import ImageUploadService from '@/lib/imageUpload';
import { auth } from '@/lib/firebase';

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    ClientPostService.getPostById(params.id).then((p) => p && setPost(p as any));
  }, [params?.id]);

  const update = (k: keyof Post, v: any) => setPost((p) => (p ? { ...p, [k]: v } : p));

  const save = async () => {
    if (!post?.id) return;
    setSaving(true);
    try {
      await ClientPostService.updatePost(post.id, post);
    } finally {
      setSaving(false);
    }
  };

  if (!post) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <Link href={`/blog/${post.slug}`} className="text-red-600">Preview</Link>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input className="input w-full" value={post.title} onChange={(e) => update('title', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input className="input w-full" value={post.slug} onChange={(e) => update('slug', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea className="input w-full" rows={3} value={post.excerpt} onChange={(e) => update('excerpt', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input className="input w-full" value={post.category || ''} onChange={(e) => update('category', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input className="input w-full" value={(post.tags || []).join(', ')} onChange={(e) => update('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <div className="flex items-center gap-3">
            <input className="input w-full" value={post.coverImage} onChange={(e) => update('coverImage', e.target.value)} />
            <label className="btn-secondary cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !post?.id) return;
                const userId = auth.currentUser?.uid || 'admin';
                const uploaded = await ImageUploadService.uploadBlogImageOptimized(file, post.id, userId, {
                  aspect: { width: 9, height: 16 },
                  maxBytes: 200 * 1024,
                  targetLongEdge: 1600,
                  format: 'image/webp'
                });
                update('coverImage', uploaded.url);
              }} />
              Upload
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Author Name</label>
            <input className="input w-full" value={post.authorName} onChange={(e) => update('authorName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author Photo URL</label>
            <div className="flex items-center gap-3">
              <input className="input w-full" value={post.authorPhotoUrl || ''} onChange={(e) => update('authorPhotoUrl', e.target.value)} />
              <label className="btn-secondary cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !post?.id) return;
                  const userId = auth.currentUser?.uid || 'admin';
                const uploaded = await ImageUploadService.uploadBlogImageOptimized(file, `${post.id}_author`, userId, {
                  targetLongEdge: 512,
                  maxBytes: 120 * 1024,
                  format: 'image/webp'
                });
                  update('authorPhotoUrl', uploaded.url);
                }} />
                Upload
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content (HTML)</label>
          <textarea className="input w-full" rows={14} value={post.contentHtml} onChange={(e) => update('contentHtml', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="input w-full" value={post.status} onChange={(e) => update('status', e.target.value as any)}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Scheduled At (ISO)</label>
            <input className="input w-full" placeholder="2025-08-13T10:00:00.000Z" onChange={(e) => update('scheduledAt' as any, (e.target.value ? (new Date(e.target.value) as any) : null))} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
          <Link href={`/blog/${post.slug}`} className="btn-secondary">View</Link>
        </div>
      </div>
    </div>
  );
}


