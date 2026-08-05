"use client";

import { useMemo, useState } from "react";
import GithubSlugger from "github-slugger";

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

    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
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
              style={{ paddingLeft: `${(h.level - 2) * 1}rem` }}
            >
              <a
                href={`#${h.id}`}
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
