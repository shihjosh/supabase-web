import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePost } from "../actions";
import PostForm from "@/components/post-form";

export const metadata = {
  title: "編輯文章 | Josh",
};

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
    .select("id, slug, title, excerpt, content, published, scheduled_at, tags")
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

      <PostForm
        action={updatePostWithId}
        submitLabel="儲存變更"
        error={queryError}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          tags: (post.tags ?? []).join(", "),
          content: post.content,
          published: post.published,
          scheduledAt: post.scheduled_at,
        }}
      />
    </main>
  );
}
