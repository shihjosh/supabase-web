import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import Comments from "@/components/comments";

export const revalidate = 0;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, content, created_at, tags")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/blog"
        className="mb-8 inline-block font-mono text-sm text-slate-500 hover:text-cyan-300"
      >
        ← 回到部落格列表
      </Link>

      <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-400">
        <p className="font-mono text-xs text-cyan-400">
          {new Date(post.created_at).toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1>{post.title}</h1>
        <ReactMarkdown>{post.content}</ReactMarkdown>
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
    </main>
  );
}
