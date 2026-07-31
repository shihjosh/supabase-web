import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";

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
    .select("title, content, created_at")
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
        className="mb-8 inline-block text-sm text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-zinc-50"
      >
        ← 回到部落格列表
      </Link>

      <article className="prose prose-zinc max-w-none dark:prose-invert">
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          {new Date(post.created_at).toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1>{post.title}</h1>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}
