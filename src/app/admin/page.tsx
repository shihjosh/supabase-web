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
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            後台管理
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            {user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="flex h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            新增文章
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              登出
            </button>
          </form>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    post.published ? "bg-green-500" : "bg-zinc-400"
                  }`}
                />
                <h2 className="truncate font-medium text-black dark:text-zinc-50">
                  {post.title}
                </h2>
              </div>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-500">
                /blog/{post.slug} ・{" "}
                {new Date(post.created_at).toLocaleDateString("zh-TW")} ・{" "}
                {post.published ? "已發佈" : "草稿"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/${post.id}`}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
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
                  className="rounded-full border border-red-200 px-4 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                >
                  刪除
                </button>
              </form>
            </div>
          </div>
        ))}

        {!error && (!posts || posts.length === 0) && (
          <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
            還沒有文章，點右上角「新增文章」開始寫作。
          </p>
        )}
      </div>
    </main>
  );
}
