import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePost } from "../actions";

export const metadata = {
  title: "編輯文章 | Josh",
};

const inputClass =
  "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: queryError } = await searchParams;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, published, tags")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  const updatePostWithId = async (formData: FormData) => {
    "use server";
    await updatePost(id, formData);
  };

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <Link
        href="/admin"
        className="mb-8 inline-block font-mono text-sm text-slate-500 hover:text-cyan-300"
      >
        ← 回到後台
      </Link>

      <h1 className="mb-8 text-2xl font-bold tracking-tight text-white">
        編輯文章
      </h1>

      <form action={updatePostWithId} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-slate-300">
            標題
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post.title}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-slate-300">
            網址代稱（slug）
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={post.slug}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="excerpt" className="text-sm font-medium text-slate-300">
            摘要（選填）
          </label>
          <input
            id="excerpt"
            name="excerpt"
            defaultValue={post.excerpt ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="tags" className="text-sm font-medium text-slate-300">
            標籤（選填，以逗號分隔）
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={(post.tags ?? []).join(", ")}
            placeholder="next.js, 前端"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-sm font-medium text-slate-300">
            內容（支援 Markdown）
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            defaultValue={post.content}
            className={`${inputClass} font-mono text-sm`}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published}
            className="h-4 w-4"
          />
          發佈（取消勾選則存為草稿）
        </label>

        {queryError && <p className="text-sm text-red-400">{queryError}</p>}

        <button
          type="submit"
          className="mt-2 h-11 rounded-md border border-cyan-400/60 bg-cyan-500/20 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/30"
        >
          儲存變更
        </button>
      </form>
    </main>
  );
}
