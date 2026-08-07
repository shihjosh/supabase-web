-- 新增「排程發布」功能：為 posts 加入 scheduled_at 欄位
-- 邏輯：
--   published = true                      → 已發佈（立即可見）
--   published = false, scheduled_at 有值   → 已排程（排程時間一到自動可見，無需背景任務，於查詢時判斷）
--   published = false, scheduled_at 為 null → 草稿（不會出現在前台）

alter table public.posts
  add column if not exists scheduled_at timestamptz null;

create index if not exists posts_scheduled_at_idx on public.posts (scheduled_at);
