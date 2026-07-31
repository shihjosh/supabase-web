import { login } from "./actions";

export const metadata = {
  title: "登入 | Josh",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const { error, redirectTo } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        後台登入
      </h1>

      <form action={login} className="flex flex-col gap-4">
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/admin"} />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            密碼
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="mt-2 h-11 rounded-full bg-black text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          登入
        </button>
      </form>
    </main>
  );
}
