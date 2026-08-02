import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import { deletePost } from "./actions";

export const metadata = {
  title: "後台管理 | Josh",
};

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, slug, title, published, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              後台管理
            </h1>
            <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-400">
              ADMIN TERMINAL
            </span>
          </div>
          <p className="font-mono text-sm text-slate-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/about"
            className="flex h-10 items-center justify-center rounded-md border border-slate-700 px-5 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
          >
            編輯自我介紹
          </Link>
          <Link
            href="/admin/new"
            className="flex h-10 items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-500/20 px-5 text-sm font-semibold text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.2)] transition hover:bg-cyan-500/30"
          >
            新增文章
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-md border border-slate-700 px-5 text-sm font-medium text-slate-300 transition-colors hover:border-red-400/50 hover:text-red-300"
            >
              登出
            </button>
          </form>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error.message}</p>}

      <div className="flex flex-col gap-3">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-4"
          >
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    post.published
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      : "bg-slate-500"
                  }`}
                />
                <h2 className="truncate font-medium text-white">
                  {post.title}
                </h2>
              </div>
              <p className="truncate font-mono text-sm text-slate-500">
                /blog/{post.slug} ・{" "}
                {new Date(post.created_at).toLocaleDateString("zh-TW")} ・{" "}
                {post.published ? "已發佈" : "草稿"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/${post.id}`}
                className="rounded-md border border-slate-700 px-4 py-1.5 text-sm text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
              >
                編輯
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deletePost(post.id);
                }}
              >
                <button
                  type="submit"
                  className="rounded-md border border-red-500/30 px-4 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-950/40"
                >
                  刪除
                </button>
              </form>
            </div>
          </div>
        ))}

        {!error && (!posts || posts.length === 0) && (
          <p className="py-8 text-center text-slate-500">
            還沒有文章，點右上角「新增文章」開始寫作。
          </p>
        )}
      </div>
    </main>
  );
}
