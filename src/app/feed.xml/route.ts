import { NextResponse } from 'next/server';
import { dbService } from '@/lib/supabase';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const posts = await dbService.getPosts();

  const feedItemsXml = posts
    .map((post) => {
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${siteUrl}/blogs/news/${post.slug}</link>
          <guid isPermaLink="true">${siteUrl}/blogs/news/${post.slug}</guid>
          <pubDate>${post.published_at ? new Date(post.published_at).toUTCString() : new Date().toUTCString()}</pubDate>
          <description><![CDATA[${post.summary || ''}]]></description>
        </item>
      `;
    })
    .join('');

  const xmlFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>CoolBeauty News</title>
        <link>${siteUrl}/blogs</link>
        <description>Xu hướng làm đẹp nam giới, cẩm nang skincare chuẩn khoa học</description>
        <language>vi</language>
        <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
        ${feedItemsXml}
      </channel>
    </rss>
  `;

  return new NextResponse(xmlFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
