export const metadata = {
  title: "履歷 / 自我介紹 | Josh",
};

const experiences = [
  {
    period: "2023 — 至今",
    role: "軟體工程師",
    org: "某某科技股份有限公司（佔位內容）",
    description: "負責前後端功能開發、系統維運與效能優化。",
  },
  {
    period: "2021 — 2023",
    role: "初級工程師",
    org: "某某新創公司（佔位內容）",
    description: "參與產品從 0 到 1 的開發過程，熟悉全端開發流程。",
  },
];

const skills = [
  "TypeScript / JavaScript",
  "React / Next.js",
  "Node.js",
  "Supabase / PostgreSQL",
  "Tailwind CSS",
  "Git / GitHub",
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <section className="mb-16 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-3xl font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          J
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Josh（佔位姓名）
          </h1>
          <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">
            軟體工程師 ・ 熱愛打造有趣的產品
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            email@example.com ・ github.com/yourname ・ Taipei, Taiwan
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
          自我介紹
        </h2>
        <p className="leading-8 text-zinc-700 dark:text-zinc-300">
          （這裡放你的自我介紹內容。）目前從事軟體開發相關工作，對於全端開發、資料庫設計與雲端服務有豐富經驗，喜歡把想法快速實現成產品，也樂於學習新技術與分享心得。歡迎透過上方聯絡方式與我交流。
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
          工作經歷
        </h2>
        <div className="flex flex-col gap-8">
          {experiences.map((exp) => (
            <div
              key={exp.role + exp.org}
              className="border-l-2 border-zinc-200 pl-4 dark:border-zinc-800"
            >
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                {exp.period}
              </p>
              <h3 className="text-lg font-medium text-black dark:text-zinc-50">
                {exp.role} ・ {exp.org}
              </h3>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
          技能
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
