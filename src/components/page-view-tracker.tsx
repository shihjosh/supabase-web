"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const VISITOR_ID_KEY = "josh_blog_visitor_id";
const DEDUPE_PREFIX = "josh_blog_last_view_"; // + path
const DEDUPE_WINDOW_MS = 30 * 60 * 1000; // 30 分鐘內同頁不重複計數

// 常見爬蟲 / 機器人 User-Agent 關鍵字（不區分大小寫比對）。
// 這是成本最低的過濾方式：無法保證 100% 精準（進階偽裝仍可能漏網），
// 但足以濾掉 Google/Bing 等主流搜尋引擎爬蟲與常見監控工具對流量的干擾。
const BOT_UA_PATTERNS = [
  "bot",
  "spider",
  "crawler",
  "slurp",
  "googlebot",
  "bingbot",
  "baiduspider",
  "yandexbot",
  "duckduckbot",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "headlesschrome",
  "phantomjs",
  "curl",
  "wget",
  "python-requests",
  "postmanruntime",
];

function isLikelyBot(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return BOT_UA_PATTERNS.some((pattern) => ua.includes(pattern));
}

// 匿名訪客 ID：純亂數字串，存於 localStorage。
// 不涉及個資、不使用 cookie，也不會跨網站追蹤，僅用於同瀏覽器內的
// 「不重複訪客」統計（換裝置 / 換瀏覽器 / 清除資料會被視為新訪客）。
function getOrCreateVisitorId(): string | null {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    // localStorage 不可用（隱私模式等）時放棄訪客 ID，但仍記錄匿名瀏覽數
    return null;
  }
}

// 同一裝置在 30 分鐘內重複瀏覽同一頁面，不重複記錄，避免洗流量
// （例如使用者短時間內重整多次）。
function shouldSkipAsDuplicate(path: string): boolean {
  try {
    const key = DEDUPE_PREFIX + path;
    const last = localStorage.getItem(key);
    const now = Date.now();
    if (last && now - Number(last) < DEDUPE_WINDOW_MS) {
      return true;
    }
    localStorage.setItem(key, String(now));
    return false;
  } catch {
    return false;
  }
}

// 前台頁面瀏覽追蹤：只記錄路徑、時間與匿名訪客 ID，不收集任何個資
// （無 IP、無 email、無跨站 cookie）。
// 排除 /admin 及 /login，避免作者自己編輯文章時的操作被計入流量。
export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;
    // 避免同一路徑（例如 React 重複 render）在同一次掛載內重複記錄
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    if (isLikelyBot()) return;
    if (shouldSkipAsDuplicate(pathname)) return;

    const visitorId = getOrCreateVisitorId();
    const supabase = createClient();
    supabase
      .from("page_views")
      .insert({ path: pathname, visitor_id: visitorId })
      .then(() => {
        // 忽略結果；瀏覽追蹤失敗不應影響使用者體驗
      });
  }, [pathname]);

  return null;
}
