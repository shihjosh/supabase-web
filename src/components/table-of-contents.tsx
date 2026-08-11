"use client";

import { useMemo, useState } from "react";
import GithubSlugger from "github-slugger";

// rehype-sanitize 預設會替 id/name 屬性加上 "user-content-" 前綴
// （clobberPrefix，避免 DOM Clobbering 攻擊），
// 因此文章內文標題實際渲染出的 id 會是 "user-content-<slug>"。
// 目錄連結需要加上同樣的前綴，錨點跳轉才會對應到正確的標題。
const ANCHOR_PREFIX = "user-content-";

type Heading = {
  id: string;
  text: string;
  level: number;
};

function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  let inCodeFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~]/g, "").trim();
      const id = slugger.slug(text);
      headings.push({ id, text, level });
    }
  }

  return headings;
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [open, setOpen] = useState(true);

  if (headings.length < 2) return null;

  return (
    <nav className="not-prose mb-8 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between font-mono text-xs uppercase tracking-wider text-cyan-400"
      >
        <span>目錄</span>
        <span className="text-slate-500">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {headings.map((h) => (
            <li
              key={h.id}
              style={{ paddingLeft: `${(h.level - 1) * 1}rem` }}
            >
              <a
                href={`#${ANCHOR_PREFIX}${h.id}`}
                className="text-slate-400 transition-colors hover:text-cyan-300"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
