import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function GET() {
  const articles = [
    {
      title: "OpenAI's GPT-5 Changes Everything: A Deep Dive Into the Next Frontier of AI",
      slug: "openai-gpt5-deep-dive-next-frontier-ai",
      categorySlug: "ai",
      excerpt: "After months of anticipation, GPT-5 is finally here — and it's more powerful than anyone expected.",
      publishedAt: new Date("2026-07-30T10:00:00Z"),
      authorName: "Dr. Sarah Chen",
    },
    {
      title: "Samsung Galaxy S26 Ultra: The Most Powerful Android Phone Ever Made",
      slug: "samsung-galaxy-s26-ultra-review",
      categorySlug: "mobile",
      excerpt: "Samsung's latest flagship delivers unmatched performance and camera features.",
      publishedAt: new Date("2026-07-30T09:00:00Z"),
      authorName: "James Park",
    },
  ];

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles
      .map(
        (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteConfig.url}/${article.categorySlug}/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/${article.categorySlug}/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <author><![CDATA[${article.authorName}]]></author>
      <pubDate>${article.publishedAt.toUTCString()}</pubDate>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
