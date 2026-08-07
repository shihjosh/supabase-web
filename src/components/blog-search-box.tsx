"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function BlogSearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [value, setValue] = useState(urlQuery);
  // 追蹤上次同步過的 URL 查詢字串，用來偵測「外部（URL）變化」與「使用者輸入」的差異，
  // 依 React 官方建議在 render 階段用 useState 比對前次值，取代 useEffect 內同步 setState
  // （也不使用 useRef，因為 render 階段讀寫 ref 同樣不被允許）。
  const [lastSyncedQuery, setLastSyncedQuery] = useState(urlQuery);
  if (lastSyncedQuery !== urlQuery) {
    setLastSyncedQuery(urlQuery);
    if (value !== urlQuery) {
      setValue(urlQuery);
    }
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applySearch = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim()) {
      params.set("q", next.trim());
    } else {
      params.delete("q");
    }
    // 換關鍵字時回到第一頁
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : "/blog");
  };

  const handleChange = (next: string) => {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applySearch(next), 400);
  };

  return (
    <div className="relative mb-6">
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="搜尋文章標題、摘要或內容…"
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 pl-10 text-white outline-none transition-colors focus:border-cyan-400"
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
        🔍
      </span>
    </div>
  );
}
