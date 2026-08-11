import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Comments from "@/components/comments";
import MarkdownContent from "@/components/markdown-content";
import ReadingProgress from "@/components/reading-progress";
import TableOfContents from "@/components/table-of-contents";
import BackToTop from "@/components/back-to-top";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { extractFirstImage } from "@/lib/post-utils";

export const revalidate = 0;

// 純文字摘要：優先用作者填寫的 excerpt，若沒有則從內容擷取前 120 字，
// 拿掉 Markdown 語法符號，供 <meta description> 使用。
function toPlainSummary(excerpt: string | null, content: string): string {
  if (excerpt && excerpt.trim()) return excerpt.trim();
  const plain = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.slice(0, 120);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, content, excerpt, created_at, tags")
    .eq("slug", slug)
    .or(`published.eq.true,scheduled_at.lte.${new Date().toISOString()}`)
    .single();

  if (!post) {
    return { title: "文章不存在" };
  }

  const description = toPlainSummary(post.excerpt, post.content);
  const image = extractFirstImage(post.content);
  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "zh_TW",
      publishedTime: post.created_at,
      tags: post.tags ?? [],
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, content, excerpt, created_at, tags")
    .eq("slug", slug)
    .or(`published.eq.true,scheduled_at.lte.${new Date().toISOString()}`)
    .single();

  if (!post) {
    notFound();
  }

  const description = toPlainSummary(post.excerpt, post.content);
  const image = extractFirstImage(post.content);
  const url = `${SITE_URL}/blog/${slug}`;

  // Article 結構化資料（JSON-LD），提升 Google 搜尋結果顯示豐富摘要的機會
  // （發布日期、作者等），不影響畫面顯示。
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: { "@type": "Person", name: SITE_NAME },
    publisher: { "@type": "Person", name: SITE_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(image ? { image: [image] } : {}),
    ...(post.tags && post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <Link
        href="/blog"
        className="mb-8 inline-block font-mono text-sm text-slate-500 hover:text-cyan-300"
      >
        ← 回到部落格列表
      </Link>

      <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-400">
        <p className="font-mono text-xs text-cyan-400">
          {new Date(post.created_at).toLocaleDateString("zh-TW", {
            timeZone: "Asia/Taipei",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1>{post.title}</h1>
        <TableOfContents content={post.content} />
        <MarkdownContent content={post.content} />
      </article>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 not-prose">
          {post.tags.map((t: string) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 font-mono text-sm text-slate-400 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      <Comments />
      <BackToTop />
    </main>
  );
}
