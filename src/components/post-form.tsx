"use client";

import { useRef, useState } from "react";
import SubmitButton from "./submit-button";
import MarkdownContent from "./markdown-content";
import ImageUploader from "./image-uploader";

const inputClass =
  "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400";

type PostStatus = "draft" | "scheduled" | "published";

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    tags?: string;
    content?: string;
    published?: boolean;
    scheduledAt?: string | null;
  };
  submitLabel: string;
  error?: string;
};

// 將資料庫存的 ISO 字串轉成台灣時區（Asia/Taipei）的 date / time 欄位值，
// 供 <input type="date"> 與 <input type="time"> 使用。
// 不使用瀏覽器本地時區，避免因裝置時區不同造成顯示錯誤。
function toTaipeiDateTimeParts(iso?: string | null): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

function initialStatus(defaultValues?: PostFormProps["defaultValues"]): PostStatus {
  if (defaultValues?.published) return "published";
  if (defaultValues?.scheduledAt) return "scheduled";
  return defaultValues ? "draft" : "published";
}

export default function PostForm({
  action,
  defaultValues,
  submitLabel,
  error,
}: PostFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [status, setStatus] = useState<PostStatus>(initialStatus(defaultValues));
  const scheduledParts = toTaipeiDateTimeParts(defaultValues?.scheduledAt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => (prev ? `${prev}\n\n${snippet}\n` : snippet));
      return;
    }
    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? content.length;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const needsLeadingNewline = before.length > 0 && !before.endsWith("\n");
    const insertion = `${needsLeadingNewline ? "\n\n" : ""}${snippet}\n`;
    const next = `${before}${insertion}${after}`;
    setContent(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = before.length + insertion.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="content" className="text-sm font-medium text-slate-300">
            內容（支援 Markdown）
          </label>
          <div className="flex items-center gap-3">
            <ImageUploader onUploaded={insertAtCursor} />
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
        </div>

        {tab === "edit" ? (
          <textarea
            ref={textareaRef}
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
                  <MarkdownContent content={content} />
                </article>
              ) : (
                <p className="text-sm text-slate-500">尚無內容可預覽</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-300">發佈狀態</span>
        <div className="flex overflow-hidden rounded-md border border-slate-700 w-fit">
          <button
            type="button"
            onClick={() => setStatus("draft")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              status === "draft"
                ? "bg-slate-700/60 text-slate-100"
                : "bg-slate-950 text-slate-400 hover:text-slate-200"
            }`}
          >
            📝 草稿
          </button>
          <button
            type="button"
            onClick={() => setStatus("scheduled")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              status === "scheduled"
                ? "bg-amber-500/20 text-amber-200"
                : "bg-slate-950 text-slate-400 hover:text-slate-200"
            }`}
          >
            ⏰ 排程發布
          </button>
          <button
            type="button"
            onClick={() => setStatus("published")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              status === "published"
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-slate-950 text-slate-400 hover:text-slate-200"
            }`}
          >
            ✅ 立即發佈
          </button>
        </div>
        <input type="hidden" name="status" value={status} />

        {status === "scheduled" && (
          <div className="mt-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">
              排程發布時間（台灣時間 UTC+8）
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="scheduled_date"
                name="scheduled_date"
                type="date"
                required
                defaultValue={scheduledParts.date}
                className={inputClass}
              />
              <input
                id="scheduled_time"
                name="scheduled_time"
                type="time"
                required
                defaultValue={scheduledParts.time}
                className={inputClass}
              />
            </div>
            <p className="text-xs text-slate-500">
              請選擇台灣時間的日期與時間，時間一到，文章會自動出現在部落格頁面，無需手動操作。
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <SubmitButton
        pendingText="儲存中..."
        className="mt-2 h-11 rounded-md border border-cyan-400/60 bg-cyan-500/20 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
