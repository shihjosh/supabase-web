import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "部落格 | Josh",
};

export const revalidate = 0;

function extractFirstImage(content: string | null | undefined): string | null {
  if (!content) return null;
  // Markdown 圖片語法 ![alt](url)
  const mdMatch = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  if (mdMatch) return mdMatch[1];
  // 內嵌 <img src="...">
  const htmlMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (htmlMatch) return htmlMatch[1];
  return null;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("slug, title, excerpt, created_at, tags, content")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data: posts, error } = await query;

  // 取得所有已發佈文章的標籤，用來顯示標籤雲
  const { data: tagRows } = await supabase
    .from("posts")
    .select("tags")
    .eq("published", true);

  const allTags = Array.from(
    new Set((tagRows ?? []).flatMap((row) => row.tags ?? []))
  ).sort();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-white">部落格</h1>
        <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-400">
          LOG ARCHIVE
        </span>
      </div>

      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <Link
            href="/blog"
            className={`rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors ${
              !tag
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
            }`}
          >
            全部
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={`rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors ${
                tag === t
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">
          載入文章時發生錯誤，請稍後再試。
        </p>
      )}

      {!error && (!posts || posts.length === 0) && (
        <p className="text-slate-500">
          {tag ? `沒有標籤為 #${tag} 的文章。` : "目前還沒有文章。"}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {posts?.map((post) => {
          const thumbnail = extractFirstImage(post.content);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur transition hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
            >
              {thumbnail && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-950 sm:h-28 sm:w-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="font-mono text-xs text-cyan-400">
                  {new Date(post.created_at).toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-xl font-medium text-white group-hover:text-cyan-300">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="line-clamp-2 text-slate-400">{post.excerpt}</p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {post.tags.map((t: string) => (
                      <span
                        key={t}
                        className="rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 font-mono text-xs text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
