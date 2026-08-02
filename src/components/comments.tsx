"use client";

import { useEffect, useRef } from "react";

/**
 * Giscus 留言元件（基於 GitHub Discussions）。
 * 使用前請先到 https://giscus.app 依照你的 repo 產生設定值，
 * 並填入 .env.local 中對應的 NEXT_PUBLIC_GISCUS_* 變數。
 */
export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  useEffect(() => {
    if (!ref.current || !repo || !repoId || !category || !categoryId) return;
    if (ref.current.querySelector("iframe.giscus-frame")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "zh-TW");

    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId]);

  if (!repo || !repoId || !category || !categoryId) {
    return null;
  }

  return <div ref={ref} className="mt-16" />;
}
