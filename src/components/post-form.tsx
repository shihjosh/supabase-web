"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const inputClass =
  "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400";

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    tags?: string;
    content?: string;
    published?: boolean;
  };
  submitLabel: string;
  error?: string;
};

export default function PostForm({
  action,
  defaultValues,
  submitLabel,
  error,
}: PostFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-slate-300">
          標題
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-slate-300">
          網址代稱（slug{defaultValues?.slug ? "" : "，留空則自動由標題產生"}）
        </label>
        <input
          id="slug"
          name="slug"
          required={!!defaultValues?.slug}
          defaultValue={defaultValues?.slug ?? ""}
          placeholder="my-first-post"
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
          defaultValue={defaultValues?.excerpt ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className="text-sm font-medium text-slate-300">
          標籤（選填，以逗號分隔，例如：next.js, 前端, 生活）
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={defaultValues?.tags ?? ""}
          placeholder="next.js, 前端"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="text-sm font-medium text-slate-300">
            內容（支援 Markdown）
          </label>
          <div className="flex overflow-hidden rounded-md border border-slate-700">
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                tab === "edit"
                  ? "bg-cyan-500/20 text-cyan-200"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200"
              }`}
            >
              ✏️ 編輯
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                tab === "preview"
                  ? "bg-cyan-500/20 text-cyan-200"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200"
              }`}
            >
              👁 預覽
            </button>
          </div>
        </div>

        {tab === "edit" ? (
          <textarea
            id="content"
            name="content"
            required
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClass} font-mono text-sm`}
          />
        ) : (
          <>
            {/* 隱藏欄位讓 preview 模式下表單送出時內容不遺失 */}
            <input type="hidden" name="content" value={content} />
            <div className="min-h-[21rem] rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
              {title && (
                <h1 className="mb-2 text-2xl font-bold text-white">{title}</h1>
              )}
              {content ? (
                <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-400">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </article>
              ) : (
                <p className="text-sm text-slate-500">尚無內容可預覽</p>
              )}
            </div>
          </>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          name="published"
          defaultChecked={defaultValues?.published ?? true}
          className="h-4 w-4"
        />
        發佈（取消勾選則存為草稿）
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        className="mt-2 h-11 rounded-md border border-cyan-400/60 bg-cyan-500/20 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/30"
      >
        {submitLabel}
      </button>
    </form>
  );
}
