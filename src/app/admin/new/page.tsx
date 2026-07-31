import Link from "next/link";
import { createPost } from "../actions";

export const metadata = {
  title: "新增文章 | Josh",
};

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <Link
        href="/admin"
        className="mb-8 inline-block text-sm text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-zinc-50"
      >
        ← 回到後台
      </Link>

      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        新增文章
      </h1>

      <form action={createPost} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            標題
          </label>
          <input
            id="title"
            name="title"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            網址代稱（slug，留空則自動由標題產生）
          </label>
          <input
            id="slug"
            name="slug"
            placeholder="my-first-post"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="excerpt" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            摘要（選填）
          </label>
          <input
            id="excerpt"
            name="excerpt"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            內容（支援 Markdown）
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            className="rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input type="checkbox" name="published" defaultChecked className="h-4 w-4" />
          發佈（取消勾選則存為草稿）
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="mt-2 h-11 rounded-full bg-black text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          發佈文章
        </button>
      </form>
    </main>
  );
}
