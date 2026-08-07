"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTags(input: string) {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

// 將「台灣時間」的日期＋時間字串（YYYY-MM-DD, HH:mm）
// 轉成正確的 UTC ISO 字串存進資料庫。
// 台灣（Asia/Taipei）全年固定 UTC+8，無日光節約時間問題。
function parseScheduledAt(dateStr: string, timeStr: string) {
  const date = dateStr.trim();
  const time = timeStr.trim();
  if (!date || !time) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match || !timeMatch) return null;

  const [, year, month, day] = match;
  const [, hour, minute] = timeMatch;

  // 直接以 "台灣時間 = UTC+8" 組出 UTC 時間戳，不依賴伺服器所在時區。
  const utcMs = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour) - 8,
    Number(minute)
  );
  const utcDate = new Date(utcMs);
  if (Number.isNaN(utcDate.getTime())) return null;
  return utcDate.toISOString();
}

type PostFields = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  scheduled_at: string | null;
  tags: string[];
};

function buildFields(formData: FormData, slugFallback?: string): PostFields | null {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const status = String(formData.get("status") ?? "draft"); // draft | scheduled | published
  const scheduledDateRaw = String(formData.get("scheduled_date") ?? "");
  const scheduledTimeRaw = String(formData.get("scheduled_time") ?? "");
  const tags = parseTags(String(formData.get("tags") ?? ""));
  let slug = String(formData.get("slug") ?? "").trim();

  slug = slugify(slug || slugFallback || title);

  if (!title || !content || !slug) {
    return null;
  }

  const scheduledAt =
    status === "scheduled" ? parseScheduledAt(scheduledDateRaw, scheduledTimeRaw) : null;

  // status === "scheduled" 但沒有填有效時間 → 視為草稿，避免誤發佈
  const published = status === "published";

  return {
    slug,
    title,
    excerpt: excerpt || null,
    content,
    published,
    scheduled_at: status === "scheduled" ? scheduledAt : null,
    tags,
  };
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const fields = buildFields(formData);

  if (!fields) {
    redirect("/admin/new?error=請填寫標題、內容與網址代稱");
  }

  const { error } = await supabase.from("posts").insert(fields);

  if (error) {
    redirect(`/admin/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/blog");
  redirect("/admin");
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();
  const fields = buildFields(formData);

  if (!fields) {
    redirect(`/admin/${id}?error=請填寫標題、內容與網址代稱`);
  }

  const { error } = await supabase.from("posts").update(fields).eq("id", id);

  if (error) {
    redirect(`/admin/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/blog/${fields.slug}`);
  redirect("/admin");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/blog");
  redirect("/admin");
}
