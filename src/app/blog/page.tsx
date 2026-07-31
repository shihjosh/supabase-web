import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "部落格 | Josh",
};

export const revalidate = 0;

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("slug, title, excerpt, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="mb-10 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        部落格
      </h1>

      {error && (
        <p className="text-sm text-red-500">
          載入文章時發生錯誤，請稍後再試。
        </p>
      )}

      {!error && (!posts || posts.length === 0) && (
        <p className="text-zinc-500 dark:text-zinc-400">目前還沒有文章。</p>
      )}

      <div className="flex flex-col gap-8">
        {posts?.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-1 rounded-xl border border-transparent p-4 -mx-4 transition-colors hover:border-zinc-200 hover:bg-white dark:hover:border-zinc-800 dark:hover:bg-zinc-900"
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              {new Date(post.created_at).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h2 className="text-xl font-medium text-black group-hover:underline dark:text-zinc-50">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-zinc-600 dark:text-zinc-400">
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
