// 從文章 Markdown 內容中擷取第一張圖片網址，
// 供列表頁縮圖與 Open Graph 分享卡片圖片共用。
export function extractFirstImage(content: string | null | undefined): string | null {
  if (!content) return null;
  // Markdown 圖片語法 ![alt](url)
  const mdMatch = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  if (mdMatch) return mdMatch[1];
  // 內嵌 <img src="...">
  const htmlMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (htmlMatch) return htmlMatch[1];
  return null;
}
