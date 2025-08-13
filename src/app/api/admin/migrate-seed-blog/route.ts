import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BLOG_POSTS } from '@/content/blog/posts';

export async function POST() {
  try {
    const seed = BLOG_POSTS[0];
    if (!seed) {
      return NextResponse.json({ ok: false, error: 'No seed post found' }, { status: 400 });
    }

    const postsCol = collection(db, 'posts');
    const q = query(postsCol, where('slug', '==', seed.slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return NextResponse.json({ ok: true, message: 'Seed post already exists', id: snap.docs[0].id });
    }

    const docRef = await addDoc(postsCol, {
      title: seed.title,
      slug: seed.slug,
      excerpt: seed.excerpt,
      coverImage: seed.coverImage,
      contentHtml: seed.body,
      tags: seed.tags,
      authorName: 'Butterfly Authentique Editorial',
      authorPhotoUrl: '/logo.png',
      status: 'published',
      publishedAt: serverTimestamp(),
      scheduledAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (e: any) {
    console.error('Seed blog migration error:', e);
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


