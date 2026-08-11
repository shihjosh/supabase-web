import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SubmitButton from "@/components/submit-button";
import {
  updateProfile,
  createExperience,
  updateExperience,
  deleteExperience,
  createSkill,
  updateSkill,
  deleteSkill,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "./actions";

export const metadata = {
  title: "自我介紹後台",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400";
const smallInputClass =
  "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400";
const cardClass = "rounded-lg border border-slate-800 bg-slate-900/40 p-4";
const saveBtnClass =
  "rounded-full border border-cyan-400/60 bg-cyan-500/20 px-4 py-1.5 text-sm text-cyan-200 transition-colors hover:bg-cyan-500/30";
const deleteBtnClass =
  "rounded-full border border-red-500/30 px-4 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-950/40";
const detailsClass = "mt-6 rounded-lg border border-dashed border-slate-700 p-4";
const summaryClass = "cursor-pointer text-sm font-medium text-slate-300";
const addBtnClass =
  "h-10 rounded-md border border-cyan-400/60 bg-cyan-500/20 px-6 text-sm font-semibold text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.2)] transition hover:bg-cyan-500/30";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error: queryError, saved } = await searchParams;
  const supabase = await createClient();

  const [{ data: profile }, { data: experiences }, { data: skills }, { data: certificates }] =
    await Promise.all([
      supabase.from("about_profile").select("*").eq("id", 1).single(),
      supabase.from("about_experiences").select("*").order("sort", { ascending: true }),
      supabase.from("about_skills").select("*").order("sort", { ascending: true }),
      supabase.from("about_certificates").select("*").order("sort", { ascending: true }),
    ]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/admin"
        className="mb-8 inline-block font-mono text-sm text-slate-500 hover:text-cyan-300"
      >
        ← 回到後台
      </Link>

      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          編輯自我介紹頁面
        </h1>
        <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-400">
          EDIT MODE
        </span>
      </div>
      <p className="mb-8 text-sm text-slate-500">
        修改後請至{" "}
        <Link href="/about" className="text-cyan-400 underline">
          /about
        </Link>{" "}
        確認顯示效果
      </p>

      {saved && (
        <p className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-400">
          已儲存變更
        </p>
      )}
      {queryError && (
        <p className="mb-6 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-2 text-sm text-red-400">
          {queryError}
        </p>
      )}

      {/* 基本資料 */}
      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold text-white">基本資料</h2>
        <form action={updateProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">顯示姓名</label>
              <input name="name" defaultValue={profile?.name ?? ""} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">英文名字</label>
              <input
                name="english_name"
                defaultValue={profile?.english_name ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">職稱 / 頭銜</label>
            <input name="title" defaultValue={profile?.title ?? ""} className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">自我介紹內文</label>
            <textarea
              name="bio"
              rows={5}
              defaultValue={profile?.bio ?? ""}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input name="email" defaultValue={profile?.email ?? ""} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">GitHub</label>
              <input name="github" defaultValue={profile?.github ?? ""} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">所在地</label>
              <input
                name="location"
                defaultValue={profile?.location ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">頭像圖片網址（選填）</label>
            <input
              name="avatar_url"
              defaultValue={profile?.avatar_url ?? ""}
              className={inputClass}
            />
          </div>

          <SubmitButton
            pendingText="儲存中..."
            className="mt-2 h-11 self-start rounded-md border border-cyan-400/60 bg-cyan-500/20 px-8 text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            儲存基本資料
          </SubmitButton>
        </form>
      </section>

      {/* 工作經歷 */}
      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold text-white">工作經歷</h2>
        <div className="flex flex-col gap-6">
          {experiences?.map((exp) => {
            const updateWithId = async (formData: FormData) => {
              "use server";
              await updateExperience(exp.id, formData);
            };
            const deleteWithId = async () => {
              "use server";
              await deleteExperience(exp.id);
            };
            return (
              <div key={exp.id} className={cardClass}>
                <form action={updateWithId} className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      name="period"
                      defaultValue={exp.period}
                      placeholder="期間"
                      className={inputClass}
                    />
                    <input
                      name="role"
                      defaultValue={exp.role}
                      placeholder="職稱"
                      className={inputClass}
                    />
                    <input
                      name="org"
                      defaultValue={exp.org}
                      placeholder="公司"
                      className={inputClass}
                    />
                  </div>
                  <textarea
                    name="description"
                    defaultValue={exp.description}
                    rows={3}
                    placeholder="工作內容描述"
                    className={inputClass}
                  />
                  <div className="flex items-center gap-3">
                    <input
                      name="sort"
                      type="number"
                      defaultValue={exp.sort}
                      placeholder="排序"
                      className={`w-24 ${smallInputClass}`}
                    />
                    <SubmitButton pendingText="儲存中..." className={saveBtnClass}>
                      儲存
                    </SubmitButton>
                  </div>
                </form>
                <form action={deleteWithId} className="mt-2">
                  <SubmitButton pendingText="刪除中..." className={deleteBtnClass}>
                    刪除
                  </SubmitButton>
                </form>
              </div>
            );
          })}
        </div>

        <details className={detailsClass}>
          <summary className={summaryClass}>+ 新增工作經歷</summary>
          <form action={createExperience} className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input name="period" placeholder="期間，例如 2024.01 — 至今" className={inputClass} />
              <input name="role" placeholder="職稱" className={inputClass} />
              <input name="org" placeholder="公司" className={inputClass} />
            </div>
            <textarea name="description" rows={3} placeholder="工作內容描述" className={inputClass} />
            <input
              name="sort"
              type="number"
              placeholder="排序（數字越小越前面）"
              className={`w-40 ${smallInputClass}`}
            />
            <SubmitButton pendingText="新增中..." className={`self-start ${addBtnClass}`}>
              新增
            </SubmitButton>
          </form>
        </details>
      </section>

      {/* 技能 */}
      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold text-white">技能</h2>
        <div className="flex flex-col gap-4">
          {skills?.map((skill) => {
            const updateWithId = async (formData: FormData) => {
              "use server";
              await updateSkill(skill.id, formData);
            };
            const deleteWithId = async () => {
              "use server";
              await deleteSkill(skill.id);
            };
            return (
              <div
                key={skill.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3"
              >
                <form action={updateWithId} className="flex flex-1 flex-wrap items-center gap-3">
                  <input
                    name="name"
                    defaultValue={skill.name}
                    placeholder="技能名稱"
                    className={`min-w-[160px] flex-1 ${smallInputClass}`}
                  />
                  <input
                    name="level"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={skill.level}
                    className={`w-20 ${smallInputClass}`}
                  />
                  <input
                    name="sort"
                    type="number"
                    defaultValue={skill.sort}
                    className={`w-20 ${smallInputClass}`}
                  />
                  <SubmitButton pendingText="儲存中..." className={saveBtnClass}>
                    儲存
                  </SubmitButton>
                </form>
                <form action={deleteWithId}>
                  <SubmitButton pendingText="刪除中..." className={deleteBtnClass}>
                    刪除
                  </SubmitButton>
                </form>
              </div>
            );
          })}
        </div>

        <details className={detailsClass}>
          <summary className={summaryClass}>+ 新增技能</summary>
          <form action={createSkill} className="mt-4 flex flex-wrap items-center gap-3">
            <input
              name="name"
              placeholder="技能名稱"
              className={`min-w-[160px] flex-1 ${smallInputClass}`}
            />
            <input
              name="level"
              type="number"
              min={0}
              max={100}
              placeholder="熟練度 %"
              className={`w-28 ${smallInputClass}`}
            />
            <input
              name="sort"
              type="number"
              placeholder="排序"
              className={`w-24 ${smallInputClass}`}
            />
            <SubmitButton pendingText="新增中..." className={addBtnClass}>
              新增
            </SubmitButton>
          </form>
        </details>
      </section>

      {/* 證照（目前於前台隱藏，後台仍可維護資料） */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">證照</h2>
          <span className="rounded border border-slate-700 bg-slate-800/60 px-2 py-0.5 font-mono text-xs text-slate-400">
            前台已隱藏
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {certificates?.map((cert) => {
            const updateWithId = async (formData: FormData) => {
              "use server";
              await updateCertificate(cert.id, formData);
            };
            const deleteWithId = async () => {
              "use server";
              await deleteCertificate(cert.id);
            };
            return (
              <div
                key={cert.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3"
              >
                <form action={updateWithId} className="flex flex-1 flex-wrap items-center gap-3">
                  <input
                    name="name"
                    defaultValue={cert.name}
                    placeholder="證照名稱"
                    className={`min-w-[160px] flex-1 ${smallInputClass}`}
                  />
                  <input
                    name="issuing_authority"
                    defaultValue={cert.issuing_authority}
                    placeholder="發證機構"
                    className={`min-w-[160px] flex-1 ${smallInputClass}`}
                  />
                  <input
                    name="sort"
                    type="number"
                    defaultValue={cert.sort}
                    className={`w-20 ${smallInputClass}`}
                  />
                  <SubmitButton pendingText="儲存中..." className={saveBtnClass}>
                    儲存
                  </SubmitButton>
                </form>
                <form action={deleteWithId}>
                  <SubmitButton pendingText="刪除中..." className={deleteBtnClass}>
                    刪除
                  </SubmitButton>
                </form>
              </div>
            );
          })}
        </div>

        <details className={detailsClass}>
          <summary className={summaryClass}>+ 新增證照</summary>
          <form action={createCertificate} className="mt-4 flex flex-wrap items-center gap-3">
            <input
              name="name"
              placeholder="證照名稱"
              className={`min-w-[160px] flex-1 ${smallInputClass}`}
            />
            <input
              name="issuing_authority"
              placeholder="發證機構"
              className={`min-w-[160px] flex-1 ${smallInputClass}`}
            />
            <input
              name="sort"
              type="number"
              placeholder="排序"
              className={`w-24 ${smallInputClass}`}
            />
            <SubmitButton pendingText="新增中..." className={addBtnClass}>
              新增
            </SubmitButton>
          </form>
        </details>
      </section>
    </main>
  );
}
