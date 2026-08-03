import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BossIntro from "@/components/boss-intro";
import BattlefieldBackground from "@/components/battlefield-background";

export default async function Home() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();
  const connected = !error;

  return (
    <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 overflow-hidden px-6 py-24 text-center">
      <BattlefieldBackground />
      <BossIntro />
      <span
        className="animate-boot-flicker relative z-10 inline-flex items-center gap-2 rounded border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs tracking-widest text-cyan-400"
        style={{ animationDelay: "0.1s" }}
      >
        ▶ SYSTEM ONLINE
      </span>

      <div
        className="animate-fade-up relative z-10 flex flex-col items-center gap-4"
        style={{ animationDelay: "0.3s" }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          你好，我是 <span className="text-cyan-400">Josh</span> 👋
        </h1>
        <p className="max-w-md text-lg leading-8 text-slate-400">
          歡迎來到我的個人網站。這裡有我的自我介紹，也有我不定期更新的部落格。
        </p>
      </div>

      <div
        className="animate-fade-up relative z-10 flex flex-col gap-3 sm:flex-row"
        style={{ animationDelay: "0.55s" }}
      >
        <Link
          href="/about"
          className="flex h-12 items-center justify-center rounded-md border border-cyan-400/60 bg-cyan-500/20 px-6 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/30"
        >
          ⚔️ 查看自我介紹
        </Link>
        <Link
          href="/blog"
          className="flex h-12 items-center justify-center rounded-md border border-slate-600 px-6 text-sm font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white"
        >
          📜 閱讀部落格
        </Link>
      </div>

      <div
        className="animate-fade-up relative z-10 flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 font-mono text-xs"
        style={{ animationDelay: "0.8s" }}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-red-500"
          }`}
        />
        <span className="text-slate-400">
          Supabase 連線狀態：{connected ? "正常" : "異常"}
        </span>
      </div>
    </main>
  );
}
