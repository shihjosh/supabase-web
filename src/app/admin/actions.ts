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

// 將 <input type="datetime-local"> 的字串（本地時間，無時區資訊）
// 轉成 ISO 字串存進資料庫；空字串則回傳 null。
function parseScheduledAt(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
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
  const scheduledAtRaw = String(formData.get("scheduled_at") ?? "");
  const tags = parseTags(String(formData.get("tags") ?? ""));
  let slug = String(formData.get("slug") ?? "").trim();

  slug = slugify(slug || slugFallback || title);

  if (!title || !content || !slug) {
    return null;
  }

  const scheduledAt = status === "scheduled" ? parseScheduledAt(scheduledAtRaw) : null;

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
