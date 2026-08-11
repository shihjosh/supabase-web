import Link from "next/link";
import { createPost } from "../actions";
import PostForm from "@/components/post-form";

export const metadata = {
  title: "新增文章",
  robots: { index: false, follow: false },
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
        className="mb-8 inline-block font-mono text-sm text-slate-500 hover:text-cyan-300"
      >
        ← 回到後台
      </Link>

      <h1 className="mb-8 text-2xl font-bold tracking-tight text-white">
        新增文章
      </h1>

      <PostForm action={createPost} submitLabel="儲存文章" error={error} />
    </main>
  );
}
