"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";

// 在預設的安全清單基礎上，額外允許常見 SVG 標籤與屬性，
// 讓文章內容可以直接嵌入 <svg>...</svg> 並正常顯示，
// 同時仍會過濾掉 <script>、on* 事件、javascript: 連結等危險內容。
const svgTagNames = [
  "svg",
  "circle",
  "rect",
  "line",
  "path",
  "polygon",
  "polyline",
  "ellipse",
  "g",
  "text",
  "tspan",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "clipPath",
  "use",
  "title",
];

const svgAttributes = [
  "viewBox",
  "width",
  "height",
  "fill",
  "stroke",
  "strokeWidth",
  "stroke-width",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "points",
  "d",
  "transform",
  "opacity",
  "fillOpacity",
  "fill-opacity",
  "offset",
  "stopColor",
  "stop-color",
  "gradientUnits",
  "id",
  "xmlns",
  "className",
  "class",
  "textAnchor",
  "text-anchor",
  "fontSize",
  "font-size",
];

const schema: Schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), ...svgTagNames],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...((defaultSchema.attributes && defaultSchema.attributes["*"]) ?? []), "style"],
    ...Object.fromEntries(svgTagNames.map((tag) => [tag, svgAttributes])),
  },
};

function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API 不可用時靜默失敗
    }
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 font-mono text-xs text-slate-400 opacity-0 transition-opacity hover:border-cyan-400/50 hover:text-cyan-300 group-hover:opacity-100"
      >
        {copied ? "已複製 ✓" : "複製"}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
}

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
      components={{ pre: CodeBlock }}
    >
      {content}
    </ReactMarkdown>
  );
}
