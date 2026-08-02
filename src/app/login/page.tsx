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
      <span className="mb-4 inline-flex w-fit items-center gap-2 rounded border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs tracking-widest text-cyan-400">
        ▶ ACCESS TERMINAL
      </span>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-white">
        後台登入
      </h1>

      <form
        action={login}
        className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur"
      >
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/admin"} />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-mono text-sm font-medium text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="font-mono text-sm font-medium text-slate-300"
          >
            密碼
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="mt-2 h-11 rounded-md border border-cyan-400/60 bg-cyan-500/20 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/30"
        >
          登入
        </button>
      </form>
    </main>
  );
}
