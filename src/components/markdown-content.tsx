"use client";

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

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}>
      {content}
    </ReactMarkdown>
  );
}
