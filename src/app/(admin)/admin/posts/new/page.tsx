'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientPostService, Post, PostStatus } from '@/lib/services/postService';
import ImageUploadService from '@/lib/imageUpload';
import { auth } from '@/lib/firebase';

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Post>>({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '/social-preview.jpg',
    contentHtml: '',
    tags: [],
    category: '',
    authorName: 'Butterfly Authentique Editorial',
    readingTime: 3,
    status: 'draft',
    scheduledAt: null,
  });
  const [saving, setSaving] = useState(false);

  const update = (k: keyof Post, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      // Ensure safe defaults
      const payload: any = {
        ...form,
        status: form.status || 'draft',
        scheduledAt: form.status === 'scheduled' ? (form.scheduledAt || null) : null,
      };
      const id = await ClientPostService.createPost(payload as any);
      router.push(`/admin/posts/edit/${id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">New Post</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input className="input w-full" value={form.title || ''} onChange={(e) => update('title', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input className="input w-full" value={form.slug || ''} onChange={(e) => update('slug', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea className="input w-full" rows={3} value={form.excerpt || ''} onChange={(e) => update('excerpt', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <div className="flex items-center gap-3">
            <input className="input w-full" value={form.coverImage || ''} onChange={(e) => update('coverImage', e.target.value)} />
            <label className="btn-secondary cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const userId = auth.currentUser?.uid || 'admin';
                const uploaded = await ImageUploadService.uploadBlogImageOptimized(file, 'new_post_cover', userId, {
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
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input className="input w-full" value={form.category || ''} onChange={(e) => update('category', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input className="input w-full" value={(form.tags || []).join(', ')} onChange={(e) => update('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author Name</label>
          <input className="input w-full" value={form.authorName || ''} onChange={(e) => update('authorName', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author Photo URL (optional)</label>
          <div className="flex items-center gap-3">
            <input className="input w-full" value={form.authorPhotoUrl || ''} onChange={(e) => update('authorPhotoUrl', e.target.value)} />
            <label className="btn-secondary cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const userId = auth.currentUser?.uid || 'admin';
                const uploaded = await ImageUploadService.uploadBlogImageOptimized(file, 'new_post_author', userId, {
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
        <div>
          <label className="block text-sm font-medium mb-1">Content (HTML)</label>
          <textarea className="input w-full" rows={12} value={form.contentHtml || ''} onChange={(e) => update('contentHtml', e.target.value)} />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={submit} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
}


