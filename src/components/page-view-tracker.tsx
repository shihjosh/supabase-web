"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// 前台頁面瀏覽追蹤：只記錄路徑與時間，不收集任何個資（無 IP / user agent / cookie）。
// 排除 /admin 及 /login，避免作者自己編輯文章時的操作被計入流量。
export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;
    // 避免同一路徑（例如 React strict 重複 render）重複記錄
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    const supabase = createClient();
    supabase
      .from("page_views")
      .insert({ path: pathname })
      .then(() => {
        // 忽略結果；瀏覽追蹤失敗不應影響使用者體驗
      });
  }, [pathname]);

  return null;
}
