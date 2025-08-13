import { collection, addDoc, updateDoc, doc, getDocs, getDoc, query, where, orderBy, serverTimestamp, Timestamp, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type PostStatus = 'draft' | 'scheduled' | 'published';

export type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  contentHtml: string;
  tags: string[];
  authorName: string;
  authorPhotoUrl?: string;
  status: PostStatus;
  publishedAt?: Timestamp;
  scheduledAt?: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const POSTS = 'posts';

export class ClientPostService {
  static async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
    const ref = await addDoc(collection(db, POSTS), {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  static async updatePost(id: string, patch: Partial<Post>) {
    const ref = doc(db, POSTS, id);
    await updateDoc(ref, {
      ...patch,
      updatedAt: serverTimestamp(),
    });
  }

  static async getPostById(id: string) {
    const ref = doc(db, POSTS, id);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...(snap.data() as Post) }) : null;
  }

  static async listAll(limitCount = 100) {
    const q = query(collection(db, POSTS), orderBy('updatedAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Post) }));
  }

  static async getBySlug(slug: string) {
    try {
      const q1 = query(collection(db, POSTS), where('slug', '==', slug));
      const snap = await getDocs(q1);
      if (snap.empty) {
        // Fallback to REST
        const viaRest = await fetchPostBySlugViaREST(slug);
        return viaRest as any;
      }
      return { id: snap.docs[0].id, ...(snap.docs[0].data() as Post) };
    } catch (e) {
      // Fallback to REST on any client SDK error (e.g., permission/cors in incognito)
      const viaRest = await fetchPostBySlugViaREST(slug);
      return viaRest as any;
    }
  }
}

export class ServerPostService {
  static async getPublishedPosts(limitCount = 20) {
    const now = Timestamp.now();
    // status == published OR (status == scheduled AND scheduledAt <= now)
    // Firestore cannot OR; fetch two queries and merge. If scheduled query
    // needs a composite index or fails for any reason, fall back gracefully.
    const pubQ = query(
      collection(db, POSTS),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const posts: Post[] = [];

    try {
      const pubSnap = await getDocs(pubQ);
      posts.push(...pubSnap.docs.map(d => ({ id: d.id, ...(d.data() as Post) })));
    } catch (e) {
      // Fallback: if orderBy publishedAt not present on some docs, fetch without order
      const qBasic = query(collection(db, POSTS), where('status', '==', 'published'));
      const snap = await getDocs(qBasic);
      posts.push(...snap.docs.map(d => ({ id: d.id, ...(d.data() as Post) })));
    }

    try {
      const schQ = query(
        collection(db, POSTS),
        where('status', '==', 'scheduled'),
        where('scheduledAt', '<=', now),
        orderBy('scheduledAt', 'desc'),
        limit(limitCount)
      );
      const schSnap = await getDocs(schQ);
      posts.push(...schSnap.docs.map(d => ({ id: d.id, ...(d.data() as Post) })));
    } catch (e) {
      // Ignore scheduled if index not ready
    }
    // sort by publishedAt/scheduledAt desc
    return posts
      .sort((a, b) => {
        const aTime = (a.publishedAt || a.scheduledAt || a.updatedAt || now).toMillis();
        const bTime = (b.publishedAt || b.scheduledAt || b.updatedAt || now).toMillis();
        return bTime - aTime;
      })
      .slice(0, limitCount);
  }

  static async getPostBySlug(slug: string) {
    const q1 = query(collection(db, POSTS), where('slug', '==', slug), where('status', 'in', ['published', 'scheduled'] as any));
    const snap = await getDocs(q1);
    if (snap.empty) return null;
    const data = snap.docs[0];
    const post = { id: data.id, ...(data.data() as Post) };
    const now = Timestamp.now();
    if (post.status === 'scheduled' && post.scheduledAt && post.scheduledAt.toMillis() > now.toMillis()) {
      return null;
    }
    return post;
  }
}

// Server-side fallback without Firebase SDK: Firestore REST API
export async function fetchPostBySlugViaREST(slug: string): Promise<Post | null> {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!projectId) return null;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery${apiKey ? `?key=${apiKey}` : ''}`;
    const body = {
      structuredQuery: {
        from: [{ collectionId: 'posts' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'slug' },
            op: 'EQUAL',
            value: { stringValue: slug }
          }
        },
        limit: 1
      }
    } as any;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const doc = Array.isArray(data) ? data.find((d: any) => d.document)?.document : undefined;
    if (!doc) return null;
    const f = doc.fields || {};
    const get = (key: string) => f[key];
    const toString = (v: any) => (v?.stringValue ?? '') as string;
    const toTimestamp = (v: any) => v?.timestampValue ? (Timestamp.fromDate(new Date(v.timestampValue)) as any) : undefined;
    const post: Post = {
      id: doc.name?.split('/').pop(),
      title: toString(get('title')),
      slug: toString(get('slug')),
      excerpt: toString(get('excerpt')),
      coverImage: toString(get('coverImage')),
      contentHtml: toString(get('contentHtml')),
      tags: (get('tags')?.arrayValue?.values || []).map((x: any) => x.stringValue) || [],
      authorName: toString(get('authorName')),
      authorPhotoUrl: toString(get('authorPhotoUrl')) || undefined,
      status: toString(get('status')) as PostStatus,
      publishedAt: toTimestamp(get('publishedAt')),
      scheduledAt: toTimestamp(get('scheduledAt')),
      createdAt: toTimestamp(get('createdAt')),
      updatedAt: toTimestamp(get('updatedAt')),
    };
    return post;
  } catch {
    return null;
  }
}


