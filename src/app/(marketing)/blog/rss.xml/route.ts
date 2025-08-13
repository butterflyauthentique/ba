import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/content/blog/posts';

const SITE = 'https://butterflyauthentique33.web.app';

function buildRss() {
  const items = BLOG_POSTS.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid>${SITE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>
  `).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Butterfly Authentique Journal</title>
    <link>${SITE}/blog</link>
    <description>Stories on handcrafted style, art, and slow fashion.</description>
    <language>en-IN</language>
    ${items}
  </channel>
</rss>`;
}

export async function GET() {
  const xml = buildRss();
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}


