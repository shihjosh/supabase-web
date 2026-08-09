import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "網站分析 | Josh",
};

export const revalidate = 0;

type DailyView = { day: string; views: number };
type TopPost = { slug: string; title: string; views: number };

function thirtyDaysAgoIso() {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const since = thirtyDaysAgoIso();

  const [
    { data: dailyViewsRaw, error: dailyError },
    { data: topPostsRaw, error: topError },
    { count: totalViews30d },
    { count: totalViewsAll },
  ] = await Promise.all([
    supabase.rpc("daily_page_views", { days: 30 }),
    supabase.rpc("top_posts_by_views", {
      since,
      result_limit: 10,
    }),
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    supabase.from("page_views").select("id", { count: "exact", head: true }),
  ]);

  const dailyViews = (dailyViewsRaw ?? []) as DailyView[];
  const topPosts = (topPostsRaw ?? []) as TopPost[];

  const maxDailyViews = Math.max(1, ...dailyViews.map((d) => d.views));
  const maxTopViews = Math.max(1, ...topPosts.map((p) => p.views));

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <Link
        href="/admin"
        className="mb-8 inline-block font-mono text-sm text-slate-500 hover:text-cyan-300"
      >
        ← 回到後台
      </Link>

      <div className="mb-10 flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          網站分析
        </h1>
        <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-400">
          ANALYTICS
        </span>
      </div>

      {(dailyError || topError) && (
        <p className="mb-6 text-sm text-red-400">
          載入分析資料時發生錯誤，請稍後再試。
        </p>
      )}

      {/* 總覽卡片 */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="font-mono text-xs text-slate-500">近 30 天瀏覽數</p>
          <p className="mt-1 text-3xl font-bold text-cyan-300">
            {totalViews30d ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="font-mono text-xs text-slate-500">累計總瀏覽數</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {totalViewsAll ?? 0}
          </p>
        </div>
      </div>

      {/* 每日瀏覽趨勢 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white">
          每日瀏覽趨勢（近 30 天，台灣時間）
        </h2>
        {dailyViews && dailyViews.length > 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex h-40 items-end gap-1">
              {dailyViews.map((d) => (
                <div
                  key={d.day}
                  className="group relative flex-1"
                  title={`${d.day}：${d.views} 次瀏覽`}
                >
                  <div
                    className="w-full rounded-t bg-cyan-500/60 transition-colors group-hover:bg-cyan-400"
                    style={{
                      height: `${Math.max(
                        2,
                        (d.views / maxDailyViews) * 100
                      )}%`,
                      minHeight: d.views > 0 ? "4px" : "1px",
                    }}
                  />
                  <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-xs text-slate-200 group-hover:block">
                    {d.day.slice(5)} ・ {d.views}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs text-slate-600">
              <span>{dailyViews[0]?.day}</span>
              <span>{dailyViews[dailyViews.length - 1]?.day}</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-500">尚無瀏覽資料。</p>
        )}
      </section>

      {/* 熱門文章 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          熱門文章（近 30 天）
        </h2>
        {topPosts && topPosts.length > 0 ? (
          <div className="flex flex-col gap-2">
            {topPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                target="_blank"
                className="group flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 transition hover:border-cyan-400/50"
              >
                <span className="w-6 shrink-0 font-mono text-sm text-slate-500">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-slate-200 group-hover:text-cyan-300">
                  {post.title}
                </span>
                <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-cyan-400"
                    style={{
                      width: `${Math.max(4, (post.views / maxTopViews) * 100)}%`,
                    }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono text-sm text-cyan-300">
                  {post.views}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">近 30 天尚無文章瀏覽紀錄。</p>
        )}
      </section>
    </main>
  );
}
