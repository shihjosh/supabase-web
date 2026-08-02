import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "自我介紹 | Josh",
};

export const revalidate = 0;

const focusAreas = [
  {
    title: "Cloud Architect",
    desc: "AWS / GCP 雲端架構設計",
    icon: "☁️",
  },
  {
    title: "DevOps",
    desc: "CI/CD、容器化、自動化部署",
    icon: "🔁",
  },
  {
    title: "Backend Engineer",
    desc: "API 設計、資料庫優化",
    icon: "🗄️",
  },
];

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: profile }, { data: experiences }, { data: skills }] = await Promise.all([
    supabase.from("about_profile").select("*").eq("id", 1).single(),
    supabase.from("about_experiences").select("*").order("sort", { ascending: true }),
    supabase.from("about_skills").select("*").order("sort", { ascending: true }),
  ]);

  const displayName = profile?.name || "Josh";
  const englishName = profile?.english_name || "";
  const title = profile?.title || "軟體工程師 ・ 雲端工程師";
  const bio = profile?.bio || "";
  const contactLine = [profile?.email, profile?.github, profile?.location]
    .filter(Boolean)
    .join(" ・ ");
  const initial = (englishName || displayName || "J").charAt(0).toUpperCase();

  return (
    <main className="relative flex-1 overflow-hidden bg-[#05070d] text-slate-100">
      {/* 全域科技網格背景 */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-[100px]" />
      <div className="pointer-events-none fixed top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-[110px]" />

      {/* Hero — 玩家角色卡 */}
      <section className="relative">
        <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs tracking-widest text-cyan-400">
              ▶ PLAYER STATUS
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {displayName}
              {englishName && englishName !== displayName ? (
                <span className="text-cyan-400"> （{englishName}）</span>
              ) : null}
            </h1>
            <p className="mt-3 font-mono text-xl font-semibold text-cyan-300">
              &lt;{title}&gt;
            </p>
            {bio && <p className="mt-5 leading-8 text-slate-400">{bio}</p>}
            {contactLine && (
              <p className="mt-4 font-mono text-sm text-slate-500">{contactLine}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="rounded-md border border-cyan-400/60 bg-cyan-500/20 px-5 py-2.5 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/30"
                >
                  ⚔️ 聯絡我
                </a>
              )}
              <a
                href="/blog"
                className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white"
              >
                📜 看部落格
              </a>
            </div>
          </div>

          {/* 角色頭像卡 */}
          <div className="relative mx-auto flex h-80 w-72 items-center justify-center sm:w-80">
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 via-transparent to-fuchsia-500/10 shadow-[0_0_40px_rgba(34,211,238,0.15)]" />
            <div className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-cyan-400/70" />
            <div className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-cyan-400/70" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-cyan-400/70" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-cyan-400/70" />

            <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 shadow-[0_0_50px_rgba(34,211,238,0.4)]">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-52 w-52 rounded-full object-cover"
                />
              ) : (
                <span className="font-mono text-7xl font-bold text-white/90">{initial}</span>
              )}
            </div>

            <div className="absolute -bottom-2 left-2 rounded border border-orange-400/60 bg-slate-950/90 px-3 py-1 font-mono text-xs font-semibold text-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.4)]">
              ☁️ CLOUD NATIVE
            </div>
            <div className="absolute -top-2 right-0 rounded border border-fuchsia-400/60 bg-slate-950/90 px-3 py-1 font-mono text-xs font-semibold text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.4)]">
              🐳 KUBERNETES
            </div>
          </div>
        </div>

        {/* 職業 / 天賦卡 */}
        <div className="relative mx-auto mb-10 grid w-full max-w-5xl grid-cols-1 gap-4 px-6 sm:grid-cols-3">
          {focusAreas.map((item) => (
            <div
              key={item.title}
              className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-lg">
                {item.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="relative mx-auto w-full max-w-3xl px-6 pb-24">
        {/* 工作經歷 — 任務日誌 */}
        {experiences && experiences.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                工作經歷 <span className="text-cyan-400">/ 任務日誌</span>
              </h2>
              <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-400">
                QUEST LOG
              </span>
            </div>

            <div className="relative border-l-2 border-cyan-500/30 pl-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative mb-8 last:mb-0">
                  <span className="absolute -left-[38px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan-400 bg-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                  <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 backdrop-blur transition hover:border-cyan-400/50">
                    <p className="font-mono text-xs text-cyan-400">{exp.period}</p>
                    <h3 className="mt-1 text-lg font-medium text-white">
                      {exp.role} <span className="text-slate-500">・</span> {exp.org}
                    </h3>
                    {exp.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-400">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 技能 — 裝備欄 */}
        {skills && skills.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                技能 <span className="text-cyan-400">/ 裝備欄</span>
              </h2>
              <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-400">
                INVENTORY
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#070b14] p-6 shadow-[inset_0_0_60px_rgba(6,182,212,0.08)] sm:p-8">
              {/* HUD 邊框裝飾 */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-[size:22px_22px]" />
              <div className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-cyan-400/60" />
              <div className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-cyan-400/60" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-cyan-400/60" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-cyan-400/60" />

              <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {skills.map((skill) => {
                  const level = skill.level ?? 0;
                  const lower = skill.name.toLowerCase();
                  const icon = lower.includes("aws")
                    ? "☁️"
                    : lower.includes("gcp")
                      ? "🌩️"
                      : lower.includes("docker") || lower.includes("kubernetes")
                        ? "🐳"
                        : lower.includes("ci") || lower.includes("cd") || lower.includes("pipeline")
                          ? "🔁"
                          : lower.includes("python") || lower.includes("node") || lower.includes("c#")
                            ? "⚔️"
                            : lower.includes("sql") || lower.includes("mongo") || lower.includes("oracle")
                              ? "🗄️"
                              : lower.includes("linux")
                                ? "🐧"
                                : "🛡️";

                  // 依熟練度決定「裝備稀有度」
                  const rarity =
                    level >= 90
                      ? {
                          name: "傳說",
                          en: "LEGENDARY",
                          border: "border-orange-400/70",
                          text: "text-orange-300",
                          glow: "rgba(251,146,60,0.8)",
                          bg: "from-orange-500/20 via-amber-500/10 to-transparent",
                          bar: "from-orange-400 to-yellow-300",
                        }
                      : level >= 80
                        ? {
                            name: "史詩",
                            en: "EPIC",
                            border: "border-fuchsia-400/70",
                            text: "text-fuchsia-300",
                            glow: "rgba(232,121,249,0.75)",
                            bg: "from-fuchsia-500/20 via-purple-500/10 to-transparent",
                            bar: "from-fuchsia-400 to-purple-300",
                          }
                        : level >= 70
                          ? {
                              name: "稀有",
                              en: "RARE",
                              border: "border-cyan-400/70",
                              text: "text-cyan-300",
                              glow: "rgba(34,211,238,0.7)",
                              bg: "from-cyan-500/20 via-sky-500/10 to-transparent",
                              bar: "from-cyan-400 to-sky-300",
                            }
                          : {
                              name: "普通",
                              en: "COMMON",
                              border: "border-slate-400/50",
                              text: "text-slate-300",
                              glow: "rgba(148,163,184,0.5)",
                              bg: "from-slate-500/15 via-slate-500/5 to-transparent",
                              bar: "from-slate-400 to-slate-300",
                            };

                  return (
                    <div
                      key={skill.id}
                      className="rpg-card rpg-scanline group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border bg-slate-950/80 p-3 transition-transform duration-200 hover:z-10 hover:scale-110"
                      style={{
                        // @ts-expect-error CSS 自訂屬性
                        "--glow-color": rarity.glow,
                      }}
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 rounded-xl border ${rarity.border} bg-gradient-to-b ${rarity.bg}`}
                      />

                      <span
                        className={`relative rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-wider ${rarity.border} ${rarity.text}`}
                      >
                        {rarity.en}
                      </span>

                      <span className="relative text-3xl drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
                        {icon}
                      </span>

                      <span className="relative text-center text-xs font-semibold text-white">
                        {skill.name}
                      </span>

                      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${rarity.bar}`}
                          style={{ width: `${level}%` }}
                        />
                      </div>
                      <span className={`relative font-mono text-[10px] ${rarity.text}`}>
                        LV.{level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
