import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();
  const connected = !error;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          你好，我是 Josh 👋
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          歡迎來到我的個人網站。這裡有我的履歷 / 自我介紹，也有我不定期更新的部落格。
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/about"
          className="flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          查看履歷 / 自我介紹
        </Link>
        <Link
          href="/blog"
          className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          閱讀部落格
        </Link>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs dark:border-zinc-700">
        <span
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-zinc-500 dark:text-zinc-400">
          Supabase 連線狀態：{connected ? "正常" : "異常"}
        </span>
      </div>
    </main>
  );
}
