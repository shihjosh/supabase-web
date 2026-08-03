"use client";

import { useEffect, useState } from "react";

type Stage = "flash" | "vs" | "curtain" | "done";

export default function BossIntro() {
  const [stage, setStage] = useState<Stage>("flash");
  const [hpFilled, setHpFilled] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    // 已看過開場動畫的訪客，在同一個瀏覽器分頁工作階段內不重複播放
    if (typeof window !== "undefined" && sessionStorage.getItem("bossIntroPlayed")) {
      setStage("done");
      setSkip(true);
      return;
    }

    const t1 = setTimeout(() => setStage("vs"), 1000);
    const t2 = setTimeout(() => setHpFilled(true), 1300);
    const t3 = setTimeout(() => setStage("curtain"), 2600);
    const t4 = setTimeout(() => {
      setStage("done");
      sessionStorage.setItem("bossIntroPlayed", "1");
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (stage === "done" || skip) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-black">
      {/* 遭遇戰紅色閃光 */}
      {stage === "flash" && (
        <div className="animate-encounter-flash absolute inset-0 bg-gradient-to-br from-red-600/70 via-orange-500/40 to-transparent" />
      )}

      {/* 畫面震動容器 */}
      <div
        className={`relative flex h-full w-full items-center justify-center ${
          stage === "flash" ? "animate-screen-shake" : ""
        }`}
      >
        {stage === "flash" && (
          <p className="font-mono text-3xl font-black tracking-[0.3em] text-red-400 drop-shadow-[0_0_20px_rgba(248,113,113,0.8)] sm:text-5xl">
            !! 遭遇戰 !!
          </p>
        )}

        {stage === "vs" && (
          <div className="flex w-full max-w-2xl items-center justify-between gap-6 px-8">
            {/* 左：玩家 */}
            <div className="animate-vs-slam-left flex flex-1 flex-col items-center gap-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan-400 bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 text-3xl shadow-[0_0_25px_rgba(34,211,238,0.6)] sm:h-24 sm:w-24">
                🧑‍💻
              </div>
              <p className="font-mono text-xs text-cyan-300 sm:text-sm">JOSH</p>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800 sm:w-28">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 ${
                    hpFilled ? "animate-hp-fill" : "w-0"
                  }`}
                  style={hpFilled ? { width: "100%" } : undefined}
                />
              </div>
            </div>

            {/* 中：VS */}
            <p className="animate-vs-text-pop shrink-0 font-mono text-4xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] sm:text-6xl">
              VS
            </p>

            {/* 右：BOSS */}
            <div
              className="animate-vs-slam-right flex flex-1 flex-col items-center gap-2"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-orange-400 bg-gradient-to-br from-orange-500 via-red-600 to-slate-900 text-3xl shadow-[0_0_25px_rgba(251,146,60,0.6)] sm:h-24 sm:w-24">
                👾
              </div>
              <p className="font-mono text-xs text-orange-300 sm:text-sm">CAREER BOSS</p>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800 sm:w-28">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 ${
                    hpFilled ? "animate-hp-fill" : "w-0"
                  }`}
                  style={hpFilled ? { width: "100%" } : undefined}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 布幕拉開，露出真正的網頁內容 */}
      {stage === "curtain" && (
        <>
          <div className="animate-curtain-left absolute inset-y-0 left-0 w-1/2 bg-black" />
          <div className="animate-curtain-right absolute inset-y-0 right-0 w-1/2 bg-black" />
        </>
      )}
    </div>
  );
}
