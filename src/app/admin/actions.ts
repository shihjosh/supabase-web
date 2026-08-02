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

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const published = formData.get("published") === "on";
  const tags = parseTags(String(formData.get("tags") ?? ""));
  let slug = String(formData.get("slug") ?? "").trim();

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  if (!title || !content || !slug) {
    redirect("/admin/new?error=請填寫標題、內容與網址代稱");
  }

  const { error } = await supabase.from("posts").insert({
    slug,
    title,
    excerpt: excerpt || null,
    content,
    published,
    tags,
  });

  if (error) {
    redirect(`/admin/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/blog");
  redirect("/admin");
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const published = formData.get("published") === "on";
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const slug = slugify(String(formData.get("slug") ?? "").trim());

  if (!title || !content || !slug) {
    redirect(`/admin/${id}?error=請填寫標題、內容與網址代稱`);
  }

  const { error } = await supabase
    .from("posts")
    .update({
      slug,
      title,
      excerpt: excerpt || null,
      content,
      published,
      tags,
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/blog");
  redirect("/admin");
}
