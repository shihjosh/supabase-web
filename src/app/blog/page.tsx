import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "部落格 | Josh",
};

export const revalidate = 0;

const PAGE_SIZE = 10;

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
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { tag, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("slug, title, excerpt, created_at, tags, content", { count: "exact" })
    .or(`published.eq.true,scheduled_at.lte.${new Date().toISOString()}`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data: posts, error, count } = await query;

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // 取得所有已發佈文章的標籤，用來顯示標籤雲
  const { data: tagRows } = await supabase
    .from("posts")
    .select("tags")
    .or(`published.eq.true,scheduled_at.lte.${new Date().toISOString()}`);

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
                    timeZone: "Asia/Taipei",
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

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2 font-mono text-sm">
          <Link
            href={{
              pathname: "/blog",
              query: {
                ...(tag ? { tag } : {}),
                ...(currentPage > 1 ? { page: currentPage - 1 } : {}),
              },
            }}
            aria-disabled={currentPage <= 1}
            className={`rounded-md border px-3 py-1.5 transition-colors ${
              currentPage <= 1
                ? "pointer-events-none border-slate-800 text-slate-600"
                : "border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300"
            }`}
          >
            ← 上一頁
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={{
                pathname: "/blog",
                query: {
                  ...(tag ? { tag } : {}),
                  ...(p > 1 ? { page: p } : {}),
                },
              }}
              className={`rounded-md border px-3 py-1.5 transition-colors ${
                p === currentPage
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={{
              pathname: "/blog",
              query: {
                ...(tag ? { tag } : {}),
                page: Math.min(totalPages, currentPage + 1),
              },
            }}
            aria-disabled={currentPage >= totalPages}
            className={`rounded-md border px-3 py-1.5 transition-colors ${
              currentPage >= totalPages
                ? "pointer-events-none border-slate-800 text-slate-600"
                : "border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300"
            }`}
          >
            下一頁 →
          </Link>
        </div>
      )}
    </main>
  );
}
